import viewDate from "./viewDate";
import projects from "./projects";
import * as api from "../helpers/api";
import { getSunday } from "../helpers/date";
import { get, writable, type Writable } from "svelte/store";

export interface IForecast {
  _id?: string;
  weekof: Date;
  hours: number;
  projectId: string;
}

const forecasts: Writable<Record<string, Forecast>> = writable({});

export class Forecast {
  private instance: IForecast;

  constructor(instance: IForecast) {
    this.instance = instance;
  }

  get id() {
    return this.instance._id;
  }

  get project() {
    return get(projects).find((p) => p.id === this.instance.projectId);
  }

  get hours() {
    return this.instance.hours || 0;
  }

  set hours(h: number) {
    this.instance.hours = h;
    this.persist();
  }

  get weekof() {
    return this.instance.weekof || getSunday(get(viewDate));
  }

  async delete() {
    await api.call(`/forecasts/${this.id}`, "delete");
  }

  async persist() {
    await api.call("/forecasts", "put", this.instance);
  }

  serialize() {
    return this.instance;
  }

  static getByProject(pid: string) {
    return get(forecasts)[pid];
  }

  static async deleteAll() {
    await api.call("/forecasts", "delete");
    return;
  }
}

export async function add(projectId: string, date: Date, hours: number) {
  const weekof = getSunday(date);
  await api.call("/forecasts", "put", {
    projectId,
    weekof,
    hours,
  });
  await load();
}

viewDate.subscribe(async () => {
  await load();
});

export async function load(d?: Date) {
  const existing: IForecast[] = await api.call(
    `/forecasts/weekof/${+getSunday(d || get(viewDate))}`
  );

  forecasts.update(() => {
    const group = {};
    existing.forEach((f: IForecast) => {
      group[f.projectId] = new Forecast(f);
    });
    return group;
  });
}

export default forecasts;
