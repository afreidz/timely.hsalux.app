import lf from "localforage";
import { writable, type Writable } from "svelte/store";

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

class Project {
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

  get bgColor() {
    return `bg-${this.instance.color}`;
  }

  get textColor() {
    return `text-${this.instance.color}`;
  }

  constructor(instance: IProject) {
    this.instance = instance;
  }

  serialize() {
    return this.instance;
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

export default projects;
