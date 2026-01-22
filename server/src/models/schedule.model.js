// models/schedule.model.js
const mongoose = require("mongoose");
const Student = require("./student.model"); // ← IMPORTANT: Import Student model

const scheduleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    days: [
      {
        day: {
          type: String,
          required: true,
          enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
          lowercase: true,
        },
        start_time: {
          type: String,
          required: true,
          trim: true,
          uppercase: true,
          // match: /^(1[0-2]|0?[1-9]):[0-5][0-9]\s? (AM|PM)$/i,
          match: /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i,
          //  match: /^([01]\d|2[0-3]):[0-5]\d$/,
        },
        end_time: {
          type: String,
          required: true,
          trim: true,
          uppercase: true,
          match: /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i,
          // match: /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i,
          // match: /^([01]\d|2[0-3]):[0-5]\d$/,
        },
      },
    ],
    note: String,

    // Temporary field – never saved to DB, never returned
    _assignToStudents: {
      type: [mongoose.Schema.Types.ObjectId],
      select: false,
      default: undefined,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ────────────────────── VIRTUAL: Students with this schedule ──────────────────────
scheduleSchema.virtual("students", {
  ref: "Student",
  localField: "_id",
  foreignField: "schedules",
  justOne: false,
});

// ────────────────────── PRE SAVE: Format time + prevent duplicate days ──────────────────────
scheduleSchema.pre("save", function () {
  // Remember if this is a new document
  this._wasNew = this.isNew;

  // Format time
  this.days = this.days.map((slot) => ({
    ...slot,
    start_time: formatTo12Hour(slot.start_time),
    end_time: formatTo12Hour(slot.end_time),
  }));

  // Prevent duplicate days
  const seen = new Set();
  for (const d of this.days) {
    if (seen.has(d.day)) {
      throw new Error(`Day "${d.day.toUpperCase()}" is repeated`);
    }
    seen.add(d.day);
  }

  return;
});

// ────────────────────── POST SAVE: Auto-assign to students ──────────────────────
scheduleSchema.post("save", async function (doc) {
  if (!this._wasNew) return; // Only run on creation

  const studentIds = this._assignToStudents || this.get("_assignToStudents");
  if (Array.isArray(studentIds) && studentIds.length > 0) {
    await Student.updateMany(
      { _id: { $in: studentIds } },
      {
        current_schedule: doc._id,
        $addToSet: {
          schedules: doc._id,
        },
      }
    );
    console.log(
      `Schedule "${doc.name}" assigned to ${studentIds.length} student(s)`
    );
  }
});

// ────────────────────── POST DELETE: Remove from all students ──────────────────────
scheduleSchema.post(
  ["findOneAndDelete", "deleteOne", "remove"],
  async function (doc) {
    if (!doc) return;

    await Student.updateMany(
      { schedules: doc._id },
      {
        $pull: { schedules: doc._id },
        $set: { current_schedule: null }, // or pick another active one
      }
    );
    console.log(`Schedule "${doc.name}" removed from all students`);
  }
);

// ────────────────────── Helper: Clean 12-hour format ──────────────────────
function formatTo12Hour(timeStr) {
  if (!timeStr) return "";
  const clean = timeStr.toString().trim().toUpperCase().replace(/\s+/g, " ");
  const match = clean.match(/^(\d{1,2}):?(\d{2})\s*(AM|PM)?$/i);
  if (!match) return clean;
  let [_, h, m, p = "AM"] = match;
  let hours = parseInt(h);
  if (hours === 0) hours = 12;
  if (hours > 12) hours = hours % 12 || 12;
  return `${hours}:${m.padStart(2, "0")} ${p.toUpperCase()}`;
}

module.exports = mongoose.model("Schedule", scheduleSchema);
