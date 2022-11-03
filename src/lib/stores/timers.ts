import now from "./now";
import paused from "./paused";
import viewDate from "./viewDate";
import * as api from "../helpers/api";
import { isToday } from "../helpers/date";
import type { Project } from "./projects";
import type { Writable } from "svelte/store";
import settings, { load as loadSettings } from "./settings";
import projects, { load as loadProjects } from "./projects";
import { writable, get, type Unsubscriber } from "svelte/store";

export interface ITimer {
  _id?: string;
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
  }

  get afterhours() {
    return this.instance.afterhours || false;
  }

  set afterhours(b: boolean) {
    this.instance.afterhours = b;
    this.persist();
  }

  get id() {
    return this.instance._id;
  }

  get task() {
    return this.instance.task;
  }

  set task(task) {
    this.instance.task = task;
    this.persist();
  }

  get running() {
    return isToday(this.start) ? !this.instance.end : false;
  }

  get start() {
    return Timer.newDate(this.instance.start);
  }

  set start(d: Date) {
    const date = Timer.newDate(d);
    this.instance.start = date;
    this.persist();
  }

  get end() {
    if (this.instance.end) return Timer.newDate(this.instance.end);
    return Timer.newDate();
  }

  set end(d: Date) {
    const date = Timer.newDate(d);
    this.instance.end = date;
    this.persist();
  }

  get duration() {
    return Timer.newDate(new Date(+this.end - +this.start));
  }

  get hours() {
    const { rounding } = get(settings) || {};
    const hours = +this.duration / 1000 / 60 / 60;

    if (!rounding || rounding === "none" || isNaN(Number(rounding))) {
      return hours.toFixed(1);
    }

    const x = Number(rounding);
    return Math.ceil(hours / x) * x;
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

  set project(p: Project) {
    this.instance.projectId = p.id;
    this.persist();
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

  get eobd() {
    return this.scheduledEnd;
  }

  get eod() {
    const eod = Timer.newDate(this.start);
    eod.setHours(24);
    eod.setMinutes(0);
    return eod;
  }

  get sod() {
    const sod = Timer.newDate(this.start);
    sod.setHours(24);
    sod.setMinutes(0);
    return sod;
  }

  get sobd() {
    const { startofday } = get(settings) || {};

    if (!startofday) return null;

    const sobd = Timer.newDate(this.start);
    const [hh, mm] = startofday?.split(":");
    sobd.setHours(+hh);
    sobd.setMinutes(+mm);

    return sobd;
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

    await api.call(`/timers/${this.id}`, "put", this.instance);
    await Timer.update();
  }

  async delete() {
    await api.call(`/timers/${this.id}`, "delete");
    Timer.update();
  }

  static async update() {
    let existing: Timer[] = await api.call(
      `/timers/date/${+Timer.newDate(get(viewDate))}`
    );
    timers.update(() => existing.map((t) => new Timer(t)));
  }

  static async getAll() {
    return (await api.call("/timers")).map((t) => new Timer(t));
  }

  static getById(id: string) {
    return get(timers).find((t) => t.id === id);
  }

  static async getByProject(pid: string) {
    return (await api.call(`/timers/project/${pid}`)).map((t) => new Timer(t));
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

  let existing: Timer[] = await api.call(`/timers/date/${+Timer.newDate(d)}`);
  timers.update(() => existing.map((t) => new Timer(t)));
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
  let existing: Timer[] = await api.call(
    `/timers/date/${+Timer.newDate(get(viewDate))}`
  );
  timers.update(() => existing.map((t) => new Timer(t)));
}

async function add(projectId?: string, indate?: Date) {
  const date = Timer.newDate(indate);

  if (!get(settings).multipleRunning && get(timers).some((t) => t.running)) {
    const running = get(timers).filter((t) => t.running);
    running.forEach((t) => t.stop());
  }

  const timer: ITimer = {
    projectId,
    start: date,
    task: "Timer",
  };

  const { insertedId: ntid } = await api.call("/timers", "post", timer);
  await Timer.update();

  const nt = Timer.getById(ntid);

  if (get(settings).autoSnap) {
    nt.start = nt.previousTimer ? nt.previousTimer.end : nt.sobd || nt.sod;
    await Timer.update();
  }

  if (!isToday(date)) {
    nt?.stop(nt.start);
    await Timer.update();
  }
}

async function deleteAllTimers() {
  await api.call("/timers", "delete");
  await Timer.update();
}

export default timers;
export { add, viewDate, deleteAllTimers, load };
