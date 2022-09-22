import lf from "localforage";
import { Timer } from "./timers";
import { writable, type Writable, get } from "svelte/store";

export interface IProject {
  id: string;
  name: string;
  color: string;
  imgurl?: string;
}

const projects: Writable<Project[]> = writable([]);
const persistence = lf.createInstance({
  name: "projects.time.me",
});

export class Project {
  public timers: Timer[];
  private instance: IProject;

  constructor(instance: IProject) {
    this.instance = instance;
    this.timers = [];
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

  get image() {
    return this.instance.imgurl;
  }

  set image(i: string) {
    this.instance.imgurl = i;
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

  get hasRunningTimer() {
    return this.timers.some((t) => t.running);
  }

  serialize() {
    return this.instance;
  }

  persist() {
    persistence.setItem(this.id, this.serialize());
  }

  async loadTimers() {
    const timers = await Timer.getAll();
    this.timers = timers.filter((t) => t.project === this);
  }

  async refresh() {
    await this.loadTimers();
    projects.update((p) => p);
  }
}

function add(name: string, color: string, imgurl: string) {
  const project: IProject = {
    name,
    color,
    imgurl,
    id: `project_${+new Date()}`,
  };

  const projectClass = new Project(project);
  projectClass.persist();
  projects.update((projects) => [...projects, projectClass]);
}

let existing: Project[] = [];
await persistence.iterate(async (v: IProject) => {
  existing.push(new Project(v));
});

projects.set(existing);

export { add, projects };
