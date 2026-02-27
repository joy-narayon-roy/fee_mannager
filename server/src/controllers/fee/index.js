const { default: mongoose } = require("mongoose");
const models = require("../../models");
const { createError } = require("../../tools");

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getFees(req, res, next) {
  try {
    const { limit = 100, page = 1 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};

    let query = models.Fee.find(filter).limit(Number(limit)).skip(skip);

    const [fees, total] = await Promise.all([
      query,
      models.Fee.countDocuments(filter),
    ]);

    res.status(200).json({ total, fees });
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getFeeById(req, res, next) {
  try {
    const { id } = req.params;

    const fee = await models.Fee.findById(id).populate({
      path: "student",
      select: "name class fee status",
      populate: {
        path: "fees", // <-- studentSchema.virtual("fees")
        match: { _id: { $ne: id } }, // optional: exclude current fee
        options: {
          sort: { year: -1, month: -1 },
        },
      },
    });

    return res.status(200).json(fee);
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function createFee(req, res, next) {
  try {
    if (!req.body) {
      throw createError("Provide infomation to create fee!", 400);
    }

    const { student, year, month, discount = 0 } = req.body;

    if (student && !mongoose.Types.ObjectId.isValid(student)) {
      throw createError(`Invalid student!`);
    }

    const exists_student = await models.Student.findById(student, {
      fee: 1,
      status: 1,
    });

    if (!exists_student) {
      throw createError("Student not found!", 404);
    }
    if (exists_student.status != "Active") {
      throw createError("Student not active. Faild to add fee!", 400);
    }
    const date = new Date();
    const fee = new models.Fee({
      student,
      total_amount: exists_student.fee,
      // paid_amount: Math.abs(Number(paid_amount)),
      month: month || date.getMonth() + 1,
      year: year || date.getFullYear(),
      discount: Math.abs(parseInt(discount) || 0),
    });
    await fee.save();
    return res.status(200).json(fee);
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function createFeeBulk(req, res, next) {
  try {
    if (!req.body) {
      throw createError("Provide infomation to create fee!", 400);
    }

    // const { students, year, month, discount = 0 } = req.body;
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      throw createError(`Students must be a non-empty array!`);
    }

    const filterdStudents = students.map((s) => {
      const student = {
        id: s.id || null,
        month: s.month || null,
        year: s.year || null,
        discount: s.discount || 0,
      };

      if (student.id && !mongoose.Types.ObjectId.isValid(student.id)) {
        return false;
      }

      if (student.id && student.month && student.year) {
        return student;
      }
      return false;
    });

    const feeStudents = filterdStudents.reduce((pre, curr) => {
      pre[curr.id] = curr;
      return pre;
    }, {});

    const student_ids = filterdStudents.map((s) => s.id);

    if (student_ids.length == 0) {
      throw createError("No students found!", 400);
    }

    const exists_student = await models.Student.find(
      {
        _id: {
          $in: student_ids,
        },
      },
      {
        fee: 1,
        status: 1,
      },
    );

    if (exists_student.length === 0) {
      throw createError("Students not found!", 404);
    }

    const exist_active_students = exists_student.filter(
      (es) => es.status === "Active",
    );
    const date = new Date();
    const fees = exist_active_students.map((eas) => {
      const feeStudentInfo = feeStudents[eas.id];
      if (!feeStudentInfo) {
        return false;
      }
      return new models.Fee({
        student: eas.id,
        total_amount: eas.fee,
        month: feeStudentInfo.month,
        year: feeStudentInfo.year,
        discount: Math.abs(parseInt(feeStudentInfo.discount) || 0),
        createdAt: date,
        updatedAt: date,
      });
    });

    try {
      const result = await models.Fee.insertMany(fees, {
        ordered: false,
      });
      return res.status(201).json(result);
    } catch (error) {
      if (error.results) {
        return res.status(201).json(error.results);
        1;
      }
      throw createError(error);
    }
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function updateFee(req, res, next) {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id) || !req.body) {
      throw createError("Provide infomation to update fee!", 400);
    }

    const { student, year, month, discount } = req.body;

    if (student && !mongoose.Types.ObjectId.isValid(student)) {
      throw createError(`Invalid student!`);
    }

    const exists_student = await models.Student.findById(student, {
      fee: 1,
      status: 1,
    });

    if (!exists_student) {
      throw createError("Student not found!", 404);
    }
    if (exists_student.status != "Active") {
      throw createError("Student not active. Faild to add fee!", 400);
    }
    const date = new Date();
    const fee = await models.Fee.findByIdAndUpdate(id, {
      student,
      month: month || date.getMonth() + 1,
      year: year || date.getFullYear(),
      discount: Math.abs(parseInt(discount) || 0),
    });

    return res.status(200).json(fee);
  } catch (err) {
    next(err);
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function deleteFee(req, res, next) {
  try {
    throw createError("This service not availbe at this moment!", 404);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
  createFeeBulk,
};
