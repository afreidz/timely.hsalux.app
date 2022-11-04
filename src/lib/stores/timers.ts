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
  afterhours?: boolean;
}

let pollUnsubscribe: Unsubscriber;
const timers: Writable<Timer[]> = writable([]);

export class Timer {
  private instance: ITimer;

  constructor(instance: ITimer) {
    this.instance = instance;
    if (
      this.running &&
      this.scheduledEnd &&
      !this.instance.afterhours &&
      +this.start >= +this.scheduledEnd
    )
      this.afterhours = true;

    if (!this.afterhours && !isToday(this.start) && this.running) {
      this.stop(this.scheduledEnd);
    }
  }

  get afterhours() {
    return this.instance.afterhours || false;
  }

  set afterhours(b: boolean) {
    this.instance.afterhours = b;
    this.persist();
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
    const date = Timer.newDate(d);
    const { gapless } = get(settings) || {};

    if (gapless && this.previousTimer) {
      this.previousTimer.setEndAndBail(date).then(() => {
        this.instance.start = date;
        this.persist();
      });
    } else {
      this.instance.start = date;
      this.persist();
    }
  }

  get end() {
    if (this.instance.end) return this.instance.end;
    return Timer.newDate();
  }

  set end(d: Date) {
    const date = Timer.newDate(d);
    const { gapless } = get(settings) || {};

    if (gapless && this.nextTimer) {
      this.nextTimer.setStartAndBail(date).then(() => {
        this.instance.end = date;
        this.persist();
      });
    } else {
      this.setEndAndBail(date);
    }
  }

  setEndAndBail(d: Date) {
    const date = Timer.newDate(d);
    this.instance.end = date;
    return this.persist();
  }

  setStartAndBail(d: Date) {
    const date = Timer.newDate(d);
    this.instance.start = date;
    return this.persist();
  }

  get duration() {
    return Timer.newDate(new Date(+this.end - +this.start));
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

    return Math.min(endCol, 1440);
  }

  get project() {
    return get(projects).find((p) => p.id === this.instance.projectId);
  }

  get scheduledEnd() {
    const { endofday } = get(settings) || {};

    if (!endofday) return null;

    const scheduledEnd = Timer.newDate(this.start);
    const [hh, mm] = endofday?.split(":");
    scheduledEnd.setHours(+hh);
    scheduledEnd.setMinutes(+mm);

    return scheduledEnd;
  }

  get eod() {
    const eod = Timer.newDate(this.start);
    eod.setHours(24);
    eod.setMinutes(0);
    return eod;
  }

  get nextTimer() {
    return get(timers).find((t) => t.start > this.start);
  }

  get previousTimer() {
    const sort = get(timers).sort((a, b) => +a.start - +b.start);
    const idx = sort.indexOf(this);
    return sort[idx - 1];
  }

  stop(d?: Date) {
    const date = Timer.newDate(d);
    this.instance.end = date;
    this.persist();
  }

  unstop() {
    this.instance.end = null;

    if (this.scheduledEnd && +new Date() > +this.scheduledEnd) {
      this.afterhours = true;
    } else {
      this.persist();
    }
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

  static newDate(indate: Date = null) {
    const d = indate ? new Date(indate) : new Date();
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  }
}

viewDate.subscribe(async (d) => {
  if (!d) return;
  pollUnsubscribe?.();

  let existing: Timer[] = await persistence.get(d);
  timers.set(existing);
  console.log("Rendering Timers:", get(timers));

  if (isToday(d)) {
    pollUnsubscribe = now.subscribe((n) => {
      if (!get(paused)) timers.update((t) => t);

      if (get(settings)?.autoStop && isToday(n)) {
        get(timers).forEach((t) => {
          if (
            +n >= +t.eod ||
            (+n >= +t.scheduledEnd && !t.afterhours && t.running)
          )
            t.stop();
        });
      }
    });
  }
});

async function load() {
  await loadSettings();
  await loadProjects();
  let existing: Timer[] = await persistence.get(get(viewDate));
  timers.set(existing);
}

async function add(projectId?: string, indate?: Date) {
  const date = Timer.newDate(indate);
  const now = Timer.newDate();

  if (get(settings).endofday) {
    const scheduledEnd = Timer.newDate(indate);
    const [hh, mm] = get(settings).endofday?.split(":");
    scheduledEnd.setHours(+hh);
    scheduledEnd.setMinutes(+mm);
  }

  if (!get(settings).multipleRunning && get(timers).some((t) => t.running)) {
    const running = get(timers).filter((t) => t.running);
    running.forEach((t) => t.stop());
  }

  const latestTimer = get(timers).reduce(
    (a, b) => (a?.end > b?.end ? a : b),
    null
  );

  if (get(settings).gapless) {
    if (latestTimer) {
      date.setHours(latestTimer.end.getHours());
      date.setMinutes(latestTimer.end.getMinutes());
      date.setSeconds(latestTimer.end.getSeconds());
    } else if (get(settings).startofday) {
      const [hh, mm] = get(settings).startofday.split(":");
      date.setHours(+hh);
      date.setMinutes(+mm);
    } else {
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
    nt.stop(nt.start);
  }

  await Timer.update();
}

async function deleteAllTimers() {
  await persistence.deleteAll();
  await Timer.update();
}

export default timers;
export { add, viewDate, deleteAllTimers, load };
