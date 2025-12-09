// models/payment.model.js
const Fee = require("./fee.model");
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    fees: [
      {
        fee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Fee",
          required: true,
        },
        amount_applied: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    payment_method: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Card",
        "Bank Transfer",
        "Cheque",
        "Online",
        "Other",
      ],
      default: "Cash",
    },
    payment_date: { type: Date, default: Date.now },
    notes: String,
  },
  { timestamps: true }
);

// Indexes
paymentSchema.index({ student: 1, payment_date: -1 });
paymentSchema.index({ "fees.fee": 1 });

// Validate sum of applied = total amount
paymentSchema.pre("save", function () {
  const total_aplied_amount = this.fees.reduce(
    (p, c) => (p += c.amount_applied),
    0
  );
  if (this.amount !== total_aplied_amount) {
    // "Something worng with create payment.pre('save'). amount != total_applied_amount"
    const err = new Error("Invalid payment amount!");
    err.httpStatus = 500;
    throw err;
  }
});

// After payment → update paid_amount + trigger Fee status update
paymentSchema.post("save", async function (payment) {
  const feeIds = payment.fees.map((f) => f.fee);
  const feeApliedAmount = payment.fees.reduce((pre, curr) => {
    pre[curr.fee] = curr.amount_applied;
    return pre;
  }, {});

  const fees = await Fee.find({ _id: { $in: feeIds } });

  for (const fee of fees) {
    fee.paid_amount += feeApliedAmount[fee.id];
  }

  await Promise.all(fees.map((f) => f.save()));

  // console.log(fees);
});

// Bonus: Auto-clear oldest dues first
paymentSchema.statics.payRemainingDues = async function (
  studentId,
  amount,
  method = "Cash",
  notes = ""
) {
  amount = parseInt(amount);
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    const err = new Error("Invalid Student ID!");
    err.httpStatus = 400;
    throw err;
  }
  if (!amount || amount <= 0) {
    const err = new Error("Payment amount must be more then 0!");
    err.httpStatus = 400;
    throw err;
  }

  const fees = await Fee.find({
    student: studentId,
    due_amount: {
      $gt: 0,
    },
  });

  if (fees.length === 0) {
    const err = new Error("No due found!");
    err.httpStatus = 404;
    throw err;
  }

  let remain_amount = amount;
  const dues = fees
    .map((f) => {
      const amount_applied = Math.min(f.due_amount, remain_amount);
      remain_amount -= amount_applied;
      return {
        fee: f.id,
        amount_applied,
      };
    })
    .filter((f) => f.amount_applied);

  const payment = await this.create({
    student: studentId,
    amount: Math.abs(parseInt(amount)),
    fees: dues,
    method,
    notes: notes || ``,
  });
  // await payment.save();
  return payment;
};

module.exports = mongoose.model("Payment", paymentSchema);
