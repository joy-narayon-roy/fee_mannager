// models/fee.model.js
const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true, // for fast lookups
    },

    month: {
      type: Number,
      required: true,
      min: [1, "Month must be between 1-12"],
      max: [12, "Month must be between 1-12"],
    },

    year: {
      type: Number,
      required: true,
      min: [2000, "Year seems invalid"],
      max: [2100, "Year seems invalid"],
    },

    total_amount: {
      type: Number,
      required: true,
      min: [1, "Total amount cannot be negative"],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      validate: {
        validator: function (v) {
          if (!this.total_amount) return true;
          return v <= this.total_amount;
        },
        message: "Discount cannot exceed total amount",
      },
    },

    paid_amount: {
      type: Number,
      default: 0,
      min: [0, "Paid amount cannot be negative"],
      validate: {
        validator: function (v) {
          // console.log(v, "<=", (this.total_amount || 0) - (this.discount || 0));
          return v <= (this.total_amount || 0) - (this.discount || 0);
        },
        message: "Paid amount cannot exceed payable amount",
      },
    },

    due_amount: {
      type: Number,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Unpaid", "Partial", "Paid"],
      default: "Unpaid",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ──────────────────────────────────────────────────────────────
// 1. Unique Rule: One fee record per student per month/year
// ──────────────────────────────────────────────────────────────
feeSchema.index({ student: 1, year: 1, month: 1 }, { unique: true });

// ──────────────────────────────────────────────────────────────
// 2. Fast queries you'll actually use
// ──────────────────────────────────────────────────────────────
feeSchema.index({ status: 1, year: 1, month: 1 }); // Dashboard: pending fees
feeSchema.index({ student: 1, year: 1 }); // Student fee history
feeSchema.index({ createdAt: -1 }); // Recent fees

// ──────────────────────────────────────────────────────────────
// 3. Virtual: net payable amount (total - discount)
// ──────────────────────────────────────────────────────────────
feeSchema.virtual("payable_amount").get(function () {
  return this.total_amount - (this.discount + this.paid_amount);
});

// Grok update
feeSchema.pre("save", function () {
  const payable_amount = this.total_amount - this.discount;

  // Recalculate due
  this.due_amount = payable_amount - this.paid_amount;

  // Update status
  if (this.due_amount <= 0) {
    this.status = "Paid";
  } else if (this.paid_amount > 0) {
    this.status = "Partial";
  } else {
    this.status = "Unpaid";
  }

  return;
});

// ──────────────────────────────────────────────────────────────
// 5. Clean duplicate error message
// ──────────────────────────────────────────────────────────────
// feeSchema.post("save", function (error, doc, next) {
//   if (error.name === "MongoServerError" && error.code === 11000) {
//     next(new Error("Fee for this student in this month/year already exists"));
//   } else {
//     next(error);
//   }
// });

// feeSchema.post("findOneAndUpdate", function (error, doc, next) {
//   if (error.name === "MongoServerError" && error.code === 0) {
//     next(new Error("Fee for this student in this month/year already exists"));
//   } else {
//     next(error);
//   }
// });

// ──────────────────────────────────────────────────────────────
// 6. Static helper: Create fee safely (recommended usage)
// ──────────────────────────────────────────────────────────────
feeSchema.statics.createFee = async function ({
  student,
  month,
  year,
  discount = 0,
  paid_amount = 0,
  createdBy,
}) {
  const fee = new this({
    student,
    month: month || new Date().getMonth() + 1,
    year: year || new Date().getFullYear(),
    discount,
    paid_amount,
    createdBy,
  });

  await fee.save();
  return fee;
};

module.exports = mongoose.model("Fee", feeSchema);
