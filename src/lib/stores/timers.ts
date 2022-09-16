import now from "./now";
import lf from "localforage";
import { writable, get } from "svelte/store";
import type { Writable } from "svelte/store";

export interface ITimer {
  id: string;
  end?: Date;
  start: Date;
  task: string;
  projectId?: string;
}

const cache = new Map();
const persistence = lf.createInstance({
  name: "timers.time.me",
});

const timers: Writable<Timer[]> = writable([]);
const viewDate: Writable<Date> = writable(new Date());
const existing: ITimer[] = await persistence.getItem(
  `timers_${get(viewDate).toLocaleDateString("en")}`
);

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

  get running() {
    return !!this.instance.end;
  }

  get start() {
    return this.instance.start;
  }

  get end() {
    return this.instance.end || new Date;
  }

  get duration() {
    return +this.end - +this.start;
  }

  get startCol() {
    return this.start.getHours() * 60 + this.start.getMinutes();
  }

  get endCol() {
    const endCol = this.end.getHours() * 60 + this.end.getMinutes();
    return endCol - this.startCol > 15 ? endCol : this.startCol + 15;
  }

  stop() {
    this.instance.end = new Date();
    refresh();
  }

  serialize() {
    return this.instance;
  }
}

if (existing?.length) {
  existing.forEach((t) => {
    cache.set(t.id, t);
  });
  timers.set(existing.map((t) => new Timer(t)));
}

timers.subscribe((timers) => {
  const serialized = timers.map((t) => t.serialize());
  persistence.setItem(
    `timers_${get(viewDate).toLocaleDateString("en")}`,
    serialized
  );
});

now.subscribe(() => timers.update((t) => t));

function add(projectId?: string, task = "Timer") {
  const timer: ITimer = {
    task,
    projectId,
    start: new Date(),
    id: `timer_${+new Date()}`,
  };

  const timerClass = new Timer(timer);

  timers.update((timers) => [...timers, timerClass]);
}

function refresh() {
  persistence.setItem(
    `timers_${get(viewDate).toLocaleDateString("en")}`,
    [...cache.values()].map((v) => v.serialize())
  );
}

export { add, timers };
