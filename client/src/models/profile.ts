import Schedule from "./schedule";
import Student from "./student";
type Students = {
  [key: string]: Student;
};
type Schedules = {
  [key: string]: Schedule;
};

interface InitialProfileInterface {
  students: Student[];
  schedules: Schedule[];
}

class Profile {
  #students: Students;
  #schedules: Schedules;
  constructor(info?: InitialProfileInterface) {
    this.#students = {};
    this.#schedules = {};
    if (info) {
      for (const stu of info.students) {
        this.#students[stu.id] = stu;
      }
      for (const sch of info.schedules) {
        this.#schedules[sch.id] = sch;
      }
    }
  }

  get students(): Student[] {
    return Object.values(this.#students);
  }
  get totalStudents(): number {
    return Object.keys(this.#students).length;
  }
  get schedules(): Schedule[] {
    return Object.values(this.#schedules);
  }
  get totalSchedules(): number {
    return Object.keys(this.#schedules).length;
  }

  addStudnets(stds: Student[]) {
    for (const std of stds) {
      if (std instanceof Student) {
        std.profile = this;
        this.#students[std.id] = std;
      } else {
        throw new Error("failed to add student! invalid student instance");
      }
    }
  }

  addSchedules(schs: Schedule[]) {
    for (const sch of schs) {
      sch.profile = this;
      this.#schedules[sch.id] = sch;
    }
  }

  getStudentByID(id: string): Student | null {
    return this.#students[id] || null;
  }

  getScheduleByID(id: string): Schedule | null {
    return this.#schedules[id] || null;
  }

  deleteSchedule(schedule_id: string) {
    delete this.#schedules[schedule_id];
  }
}

export default Profile;
