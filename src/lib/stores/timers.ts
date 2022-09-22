import now from "./now";
import lf from "localforage";
import { projects } from "./projects";
import type { Writable } from "svelte/store";
import { isToday, isSameDay } from "../helpers/date";
import { writable, get, type Unsubscriber } from "svelte/store";

export interface ITimer {
  id: string;
  end?: Date;
  start: Date;
  task: string;
  projectId?: string;
}

const persistence = lf.createInstance({
  name: "timers.time.me",
});

let pollUnsubscribe: Unsubscriber;
const timers: Writable<Timer[]> = writable([]);
const hashDate =
  window?.location.hash.startsWith("#viewday_") &&
  new Date(window.location.hash.split("#viewday_")[1]);
const viewDate: Writable<Date> = writable(hashDate || new Date());

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
    Timer.refresh();
  }

  get running() {
    return isToday(this.instance.start) ? !this.instance.end : false;
  }

  get start() {
    return this.instance.start;
  }

  get end() {
    return this.instance.end || new Date();
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
    return isToday(this.start) ? endCol : Math.min(endCol, 1440);
  }

  get project() {
    return get(projects).find((p) => p.id === this.instance.projectId);
  }

  shiftEnd() {
    if (this.running) return;
    this.instance.end = new Date(+this.instance.end + 1000 * 60 * 15);
    this.persist();
    Timer.refresh();
  }

  shiftStart() {
    this.instance.start = new Date(+this.instance.start - 1000 * 60 * 15);
    this.persist();
    Timer.refresh();
  }

  stop() {
    this.instance.end = new Date();
    this.project.refresh();
    this.persist();
    Timer.refresh();
  }

  unstop() {
    this.instance.end = null;
    this.project.refresh();
    this.persist();
    Timer.refresh();
  }

  serialize() {
    return this.instance;
  }

  persist() {
    persistence.setItem(this.id, this.serialize());
  }

  async delete() {
    await persistence.removeItem(this.id);
    this.project.refresh();
    timers.update((t) => t.filter((t) => t.id !== this.id));
  }

  static refresh() {
    timers.update((t) => t);
  }

  static async getAll() {
    let existing: Timer[] = [];

    await persistence.iterate((v: ITimer, k) => {
      existing.push(new Timer(v));
    });

    return existing;
  }
}

viewDate.subscribe(async (d) => {
  pollUnsubscribe?.();

  let existing: Timer[] = (await Timer.getAll()).filter((t) => {
    return isSameDay(d, t.start);
  });

  timers.set(existing);

  if (isToday(d))
    pollUnsubscribe = now.subscribe(() => timers.update((t) => t));
});

function add(projectId?: string, task = "Timer") {
  const timer: ITimer = {
    task,
    projectId,
    start: new Date(),
    id: `timer_${+new Date()}`,
  };

  const timerClass = new Timer(timer);
  timerClass.persist();
  timers.update((timers) => [...timers, timerClass]);
  timerClass.project.refresh();
}

export { add, timers, viewDate };
