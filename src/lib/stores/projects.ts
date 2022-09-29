import { get } from "svelte/store";
import timers, { Timer } from "./timers";
import { writable, type Writable } from "svelte/store";
import { projects as persistence } from "../helpers/firebase/db";

export interface IProject {
  id?: string;
  name: string;
  color: string;
  owner?: string;
}

const projects: Writable<Project[]> = writable([]);

export class Project {
  private instance: IProject;

  constructor(instance: IProject) {
    this.instance = instance;
  }

  get id() {
    return this.instance.id;
  }

  get name() {
    return this.instance.name;
  }

  set name(n: string) {
    this.instance.name = n;
    this.persist();
  }

  get color() {
    return this.instance.color;
  }

  set color(c: string) {
    this.instance.color = c;
    this.persist();
  }

  get bgColor() {
    return `bg-${this.instance.color}`;
  }

  get textColor() {
    return `text-${this.instance.color}`;
  }

  get timers() {
    return get(timers).filter((t) => t.project === this);
  }

  async persist() {
    await persistence.update(this.instance);
    await Project.update();
  }

  serialize() {
    return this.instance;
  }

  static async update() {
    return load();
  }
}

async function add(name: string, color: string) {
  const project: IProject = {
    name,
    color,
  };

  await persistence.add(project);
  await load();
}

async function load() {
  const existing = await persistence.get();
  projects.update(() => existing);
}

async function deleteAllProjects() {
  await persistence.deleteAll();
  await Project.update();
}

export default projects;
export { add, deleteAllProjects, load };
