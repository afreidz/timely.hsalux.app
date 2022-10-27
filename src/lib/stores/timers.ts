import now from "./now";
import paused from "./paused";
import viewDate from "./viewDate";
import { isToday } from "../helpers/date";
import type { Writable } from "svelte/store";
import settings, { load as loadSettings } from "./settings";
import projects, { load as loadProjects } from "./projects";
import { timers as persistence } from "../helpers/firebase/db";
import { writable, get, type Unsubscriber } from "svelte/store";

export interface ITimer {
  id?: string;
  end?: Date;
  start: Date;
  task: string;
  owner?: string;
  projectId?: string;
}

let pollUnsubscribe: Unsubscriber;
const timers: Writable<Timer[]> = writable([]);

export class Timer {
  private instance: ITimer;

  constructor(instance: ITimer) {
    this.instance = instance;
  }

  get id() {
    return this.instance.id;
  }

  get task() {
    return this.instance.task;
  }

  set task(task) {
    this.instance.task = task;
    this.persist();
  }

  get running() {
    return isToday(this.instance.start) ? !this.instance.end : false;
  }

  get start() {
    return this.instance.start;
  }

  set start(d: Date) {
    const { gapless } = get(settings) || {};

    if(gapless && this.previousTimer) {
      this.previousTimer.setEndAndBail(d).then(() => {
        this.instance.start = d;
        this.persist();
      });
    } else {
      this.instance.start = d;
      this.persist();
    }

  }

  get end() {
    if (this.instance.end) return this.instance.end;

    if (+this.scheduledEnd < +new Date()) {
      this.instance.end = this.scheduledEnd;
      this.persist();
      return this.instance.end;
    }

    return new Date();
  }

  set end(d: Date) {
    const { gapless } = get(settings) || {};

    if(gapless && this.nextTimer) {
      this.nextTimer.setStartAndBail(d).then(() => {
        this.instance.end = d;
        this.persist();
      });
    } else {
      this.instance.end = d;

    }

  }

  setEndAndBail(d: Date) {
    this.instance.end = d;
    return this.persist();
  }

  setStartAndBail(d: Date) {
    this.instance.start = d;
    return this.persist();
  }

  get duration() {
    return new Date(+this.end - +this.start);
  }

  get hours() {
    const hours = +this.duration / 1000 / 60 / 60;
    return hours.toFixed(1);
  }

  get startCol() {
    return this.start.getHours() * 60 + this.start.getMinutes();
  }

  get endCol() {
    const diff = Math.ceil(+this.duration / (1000 * 60));
    const endCol =
      this.startCol + diff - this.startCol > 15
        ? this.startCol + diff
        : this.startCol + 15;

    const scheduledEndCol =
      Math.ceil((+this.scheduledEnd - +this.start) / (1000 * 60)) +
      this.startCol;

    return Math.min(endCol, scheduledEndCol, 1440);
  }

  get project() {
    return get(projects).find((p) => p.id === this.instance.projectId);
  }

  get scheduledEnd() {
    const { endofday } = get(settings) || {};
    const scheduledEnd = new Date(this.start);
    if (endofday) {
      const [hh, mm] = endofday?.split(":");
      scheduledEnd.setHours(+hh);
      scheduledEnd.setMinutes(+mm);

      if (+this.start > +scheduledEnd) {
        scheduledEnd.setHours(24);
        scheduledEnd.setMinutes(0);
      }
    } else {
      scheduledEnd.setHours(24);
      scheduledEnd.setMinutes(0);
    }
    return scheduledEnd;
  }

  get nextTimer() {
    return get(timers).find(t => t.start > this.start);
  }

  get previousTimer() {
    const sort = get(timers).sort((a,b) => +a.start - +b.start);
    const idx = sort.indexOf(this);
    return sort[idx-1];
  }

  stop(d: Date = new Date()) {
    this.instance.end = d;
    this.persist();
  }

  unstop() {
    this.instance.end = null;
    this.persist();
  }

  serialize() {
    return this.instance;
  }

  async persist() {
    if (!this.instance.end) delete this.instance.end;

    await persistence.update(this.instance);
    await Timer.update();
  }

  async delete() {
    await persistence.delete(this.instance);
    Timer.update();
  }

  static async update() {
    let existing: Timer[] = await persistence.get(get(viewDate));
    timers.update(() => existing);
  }

  static async getAll() {
    return await persistence.getAll();
  }

  static async getByProject(pid: string) {
    return await persistence.getByProject(pid);
  }
}

viewDate.subscribe(async (d) => {
  if (!d) return;
  pollUnsubscribe?.();

  let existing: Timer[] = await persistence.get(d);
  timers.set(existing);
  console.log("Rendering Timers:", get(timers));

  if (isToday(d)) {
    pollUnsubscribe = now.subscribe(() => {
      if (!get(paused)) timers.update((t) => t);
    });
  }
});

async function load() {
  await loadSettings();
  await loadProjects();
  let existing: Timer[] = await persistence.get(get(viewDate));
  timers.set(existing);
}

async function add(projectId?: string, date: Date = new Date()) {
  const now = new Date();

  if(!get(settings).multipleRunning && get(timers).some(t => t.running)) {
    const running = get(timers).filter(t => t.running);
    running.forEach(t => t.stop());
  }

  const latestTimer = get(timers).reduce((a,b) => (a?.end > b?.end ? a : b), null);

  if(get(settings).gapless) {
    if(latestTimer) {
      date.setHours(latestTimer.end.getHours());
      date.setMinutes(latestTimer.end.getMinutes());
      date.setSeconds(latestTimer.end.getSeconds());
    } else if(get(settings).startofday) {
      const [hh, mm] = get(settings).startofday.split(":");
      date.setHours(+hh);
      date.setMinutes(+mm);
    }else {
      date.setHours(9);
      date.setMinutes(0);
    }
  } else {
    date.setHours(now.getHours());
    date.setMinutes(now.getMinutes());
    date.setSeconds(now.getSeconds());
  }


  const timer: ITimer = {
    projectId,
    start: date,
    task: "Timer",
  };

  const nt = await persistence.add(timer);

  if (!isToday(date)) {
    nt?.stop();
  }

  await Timer.update();
}

async function deleteAllTimers() {
  await persistence.deleteAll();
  await Timer.update();
}

export default timers;
export { add, viewDate, deleteAllTimers, load };
