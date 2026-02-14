// models/student.model.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    class: {
      type: String,
      required: [true, "Class is required"],
    },
    short_id: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Pending",
    },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    notes: { type: String, default: "" },

    // NEW: Multiple schedules (only one active)
    schedules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
      },
    ],

    // Fast access to current active schedule
    current_schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

// Auto update current_schedule & enforce only ONE active
studentSchema.pre("save", function () {
  // Make sure only one schedule is active
  let activeCount = 0;
  let activeScheduleId = null;

  this.schedules.forEach((s) => {
    if (s.is_active) {
      activeCount++;
      activeScheduleId = s.schedule;
    }
  });

  if (activeCount > 1) {
    throw new Error("Only one schedule can be active at a time");
  }

  this.current_schedule = activeScheduleId;

  // Your existing logic (short_id, dates)
  if (this.isNew || this.isModified("status")) {
    if (this.status === "Active") {
      this.start_date = this.start_date || new Date();
      this.end_date = null;
    } else if (this.status === "Inactive") {
      this.end_date = this.end_date || new Date();
    }
  }

  // Generate short_id
  if (!this.short_id) {
    const base = (this.name || "XXX")
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, "X");
    let shortId = base;
    let counter = 0;
    const checkAndSet = async () => {
      while (counter < 100) {
        const exists = await this.constructor.findOne({ short_id: shortId });
        if (!exists) {
          this.short_id = shortId;
          return;
        }
        counter++;
        shortId = `${base}${counter.toString().padStart(2, "0")}`;
      }
      throw new Error("Cannot generate unique short_id");
    };
    return checkAndSet();
  }

  return;
});

// Keep your updateOne middleware as-is (it's fine)
studentSchema.pre(["updateOne", "findOneAndUpdate"], async function () {
  const update = this.getUpdate();
  const status = update.status || update.$set?.status;
  if (!status) return;

  const now = new Date();
  if (status === "Active") {
    this.set({ start_date: update.start_date || now, end_date: null });
  } else if (status === "Inactive") {
    this.set({ end_date: update.end_date || now });
  }
});

studentSchema.virtual("fees", {
  ref: "Fee",
  localField: "_id",
  foreignField: "student",
});

studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Student", studentSchema);
