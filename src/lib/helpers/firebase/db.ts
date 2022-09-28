import app from "./app";
import { get } from "svelte/store";
import auth from "../../stores/auth";
import { Timer, type ITimer } from "../../stores/timers";
import type { ISettings } from "src/lib/stores/settings";
import { Project, type IProject } from "../../stores/projects";
import {
  doc,
  query,
  where,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore(app);
export default db;

const projectConverter = {
  toFirestore: (p: Project) => p.serialize(),
  fromFirestore: (s, o) => {
    const data = s.data(o);
    data.id = s.id;
    return new Project(data);
  },
};

const timerConverter = {
  toFirestore: (p: Timer) => p.serialize(),
  fromFirestore: (s, o) => {
    const data = s.data(o);
    data.start = data.start.toDate();
    data.end = data.end?.toDate();
    data.id = s.id;
    return new Timer(data);
  },
};

const projects = {
  async get() {
    console.log("db call: get projects");
    const uid = get(auth)?.uid;
    if (!uid) throw new Error("no authorized user");

    const existing = [];
    const projectRef = collection(db, "projects").withConverter(
      projectConverter
    );
    const q = query(projectRef, where("owner", "==", uid));
    (await getDocs(q)).forEach((doc) => existing.push(doc.data()));
    return existing;
  },
  async add(project: IProject) {
    console.log("db call: add project");
    const uid = get(auth)?.uid;
    if (!uid) throw new Error("no authorized user");

    project.owner = uid;
    await addDoc(collection(db, "projects"), project);
  },
  async update(project: IProject) {
    console.log("db call: update project");
    await setDoc(doc(db, "projects", project.id), project);
  },
  async delete(project: IProject) {
    console.log("db call: delete project");
    await deleteDoc(doc(db, "projects", project.id));
  },
  async deleteAll() {
    console.log("db call: delete all projects");
    const projects = await this.get();
    for await (const project of projects) {
      deleteDoc(doc(db, "projects", project.id));
    }
  },
};

const timers = {
  async get(date: Date) {
    console.log("db call: get timers");
    if (!date) return [];
    const uid = get(auth)?.uid;
    if (!uid) throw new Error("no authorized user");

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const existing = [];
    const timerRef = collection(db, "timers").withConverter(timerConverter);

    const q = query(
      timerRef,
      where("owner", "==", uid),
      where("start", ">", date),
      where("start", "<", new Date(+date + 1000 * 60 * 60 * 24))
    );
    (await getDocs(q)).forEach((doc) => existing.push(doc.data()));

    existing.forEach((t) => {});

    return existing;
  },
  async getAll() {
    console.log("db call: get all timers");
    const uid = get(auth)?.uid;
    if (!uid) throw new Error("no authorized user");

    const existing = [];
    const timerRef = collection(db, "timers").withConverter(timerConverter);
    const q = query(timerRef, where("owner", "==", uid));
    (await getDocs(q)).forEach((doc) => existing.push(doc.data()));
    return existing;
  },
  async add(timer: ITimer) {
    console.log("db call: add timer");
    const uid = get(auth)?.uid;
    if (!uid) throw new Error("no authorized user");

    timer.owner = uid;
    await addDoc(collection(db, "timers"), timer);
  },
  async update(timer: ITimer) {
    console.log("db call: update timer");
    await setDoc(doc(db, "timers", timer.id), timer);
  },
  async delete(timer: ITimer) {
    console.log("db call: delete timer");
    await deleteDoc(doc(db, "timers", timer.id));
  },
  async deleteAll() {
    console.log("db call: delete all timers");
    const timers = await this.getAll();
    for await (const timer of timers) {
      deleteDoc(doc(db, "timers", timer.id));
    }
  },
};

const settings = {
  async get() {
    console.log("db call: get settings");
    const uid = get(auth)?.uid;
    if (!uid) throw new Error("no authorized user");

    const settings = await getDoc(doc(db, "settings", uid));
    return settings.data();
  },
  async update(settings: ISettings): Promise<void> {
    console.log("db call: update settings");
    const uid = get(auth)?.uid;
    if (!uid) throw new Error("no authorized user");
    await setDoc(doc(db, "settings", uid), settings);
  },
};

export { projects, timers, settings };
