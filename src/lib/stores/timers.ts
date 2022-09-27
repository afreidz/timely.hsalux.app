import now from "./now";
import paused from "./paused";
import viewDate from "./viewDate";
import { isToday } from "../helpers/date";
import type { Writable } from "svelte/store";
import settings, { load as loadSettings } from "./settings";
import { timers as persistence } from "../helpers/firebase/db";
import { writable, get, type Unsubscriber } from "svelte/store";
import projects, { Project, load as loadProjects } from "./projects";

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
    Timer.update();
  }

  get running() {
    return isToday(this.instance.start) ? !this.instance.end : false;
  }

  get start() {
    return this.instance.start;
  }

  get startString() {
    return `${("0" + this.instance.start.getHours()).slice(-2)}:${(
      "0" + this.instance.start.getMinutes()
    ).slice(-2)}`;
  }

  set startString(s) {
    if (!s) return;
    const [hh, mm] = s.split(":");
    this.instance.start.setHours(+hh);
    this.instance.start.setMinutes(+mm);
    this.persist();
    Timer.update();
  }

  get end() {
    return this.instance.end || new Date();
  }

  get endString() {
    return `${("0" + this.end.getHours()).slice(-2)}:${(
      "0" + this.end.getMinutes()
    ).slice(-2)}`;
  }

  set endString(s) {
    if (!s) return;
    const [hh, mm] = s.split(":");
    if (this.running) this.stop();
    if (!this.instance.end) this.instance.end = this.instance.start;
    this.instance.end.setHours(+hh);
    this.instance.end.setMinutes(+mm);
    this.persist();
    Timer.update();
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

  shiftEnd(min = 5) {
    if (this.running) return;
    this.instance.end = new Date(+this.instance.end + 1000 * 60 * min);
    this.persist();
    Timer.update();
  }

  unshiftEnd(min = 5) {
    if (this.running) return;
    const unshifted = new Date(+this.instance.end - 1000 * 60 * min);
    if (+unshifted - +this.start <= 1000 * 60) return;
    this.instance.end = unshifted;
    this.persist();
    Timer.update();
  }

  shiftStart(min = 5) {
    this.instance.start = new Date(+this.instance.start - 1000 * 60 * min);
    this.persist();
    Timer.update();
  }

  unshiftStart(min = 5) {
    const unshifted = new Date(+this.instance.start + 1000 * 60 * min);
    if (+this.end - +unshifted <= 1000 * 60) return;
    this.instance.start = unshifted;
    this.persist();
    Timer.update();
  }

  stop() {
    this.instance.end = new Date();
    Project.update();
    this.persist();
    Timer.update();
  }

  unstop() {
    this.instance.end = null;
    Project.update();
    this.persist();
    Timer.update();
  }

  serialize() {
    return this.instance;
  }

  async persist() {
    if (!this.instance.end) delete this.instance.end;
    await persistence.update(this.instance);
  }

  async delete() {
    await persistence.delete(this.instance);
    Project.update();
    Timer.update();
  }

  static async update() {
    let existing: Timer[] = await persistence.get(get(viewDate));
    timers.update(() => existing);
  }

  static async getAll() {
    return await persistence.getAll();
  }
}

viewDate.subscribe(async (d) => {
  if (!d) return;
  pollUnsubscribe?.();

  let existing: Timer[] = await persistence.get(d);
  timers.set(existing);

  if (isToday(d)) pollUnsubscribe = now.subscribe(handlePollSubscription);
});

async function load() {
  await loadProjects();
  let existing: Timer[] = await persistence.get(get(viewDate));
  timers.set(existing);
}

async function handlePollSubscription() {
  if (get(paused)) return;
  await loadSettings();
  const { autoStop, endofday } = get(settings) ?? {};

  if (autoStop && endofday) {
    const [hour, min] = endofday.split(":");
    const check = new Date();
    check.setHours(+hour);
    check.setMinutes(+min);

    (await Timer.getAll()).forEach((t: Timer) => {
      if (t.running && +t.end >= +check) t.stop();
    });
  }

  timers.update((t) => t);
}

async function add(projectId?: string, task = "Timer") {
  const timer: ITimer = {
    task,
    projectId,
    start: new Date(),
  };

  await persistence.add(timer);
  await Timer.update();
  await Project.update();
}

async function deleteAllTimers() {
  await persistence.deleteAll();
  await Timer.update();
  await Project.update();
}

export default timers;
export { add, viewDate, deleteAllTimers, load };
