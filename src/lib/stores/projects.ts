import lf from "localforage";
import { timers } from "./timers";
import { writable, type Writable, get } from "svelte/store";

export interface IProject {
  id: string;
  name: string;
  color: string;
  imgurl?: string;
}

const cache = new Map();
const persistence = lf.createInstance({
  name: "projects.time.me",
});

const projects: Writable<Project[]> = writable([]);
const existing: IProject[] = await persistence.getItem("projects");

export class Project {
  private instance: IProject;

  get id() {
    return this.instance.id;
  }

  get name() {
    return this.instance.name;
  }

  get image() {
    return this.instance.imgurl;
  }

  get color() {
    return this.instance.color;
  }

  get bgColor() {
    return `bg-${this.instance.color}`;
  }

  get textColor() {
    return `text-${this.instance.color}`;
  }

  get timers() {
    return get(timers).filter(t => t.project === this);
  }

  get hasRunningTimer() {
    const projectTimers = this.timers;
    return projectTimers.some(t => t.running);
  }

  constructor(instance: IProject) {
    this.instance = instance;
  }

  serialize() {
    return this.instance;
  }

  refresh() {
    projects.update(p => ([...p]));
  }
}

if (existing?.length) {
  existing.forEach((t) => {
    cache.set(t.id, t);
  });
  projects.set(existing.map((p) => new Project(p)));
}

projects.subscribe((projects) => {
  const serialized = projects.map((p) => p.serialize());
  persistence.setItem("projects", serialized);
});

function add(name: string, color: string, imgurl: string) {
  const project: IProject = {
    name,
    color,
    imgurl,
    id: `project_${+new Date}`,
  };

  const projectClass = new Project(project);

  projects.update((projects) => [...projects, projectClass]);
}


export { add, projects };
