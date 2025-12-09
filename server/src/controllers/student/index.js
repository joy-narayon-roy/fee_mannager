const { mongo } = require("mongoose");
const models = require("../../models");
const { createError, capitalizeFirst } = require("../../tools");
const { default: mongoose } = require("mongoose");

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getStudents(req, res, next) {
  try {
    const students = await models.Student.find()
      .populate("fees")
      .populate("schedules");

    return res.status(200).json(students);
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
async function getStudentById(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      throw createError("Provide ID to get student!", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(`Invalid id: ${id}`, 400);
    }

    const student = await models.Student.findById(id)
      .populate("fees")
      .populate("schedules");
    if (!student) {
      throw createError(`${id} not found!`, 404);
    }
    return res.status(200).json(student);
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
async function createStudent(req, res, next) {
  try {
    if (!req.body) {
      throw createError("Provide infomation to create student!", 400);
    }
    const {
      name,
      short_id,
      fee,
      status,
      class: classNum,
      start_date,
      end_date,
      notes,
    } = req.body;

    const student = models.Student({
      name,
      short_id,
      fee,
      status: capitalizeFirst(status),
      class: classNum,
      start_date,
      end_date,
      notes,
    });
    await student.save();
    return res.status(200).json(student);
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
async function deleteByID(req, res, next) {
  try {
    throw createError("he service is temporarily unavailable.");
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(`Invalid id!`, 400);
    }
    const student = await models.Student.findByIdAndDelete(id);
    return res.status(200).json(student);
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
async function updateStudent(req, res, next) {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id) || !req.body) {
      throw createError("Invalid request!", 400);
    }
    const {
      name,
      class: classNum,
      fee,
      status,
      start_date,
      end_date,
      notes,
      current_schedule,
      schedules_add,
      schedules_remove,
    } = req.body;

    const updateObj = {};

    if (name && name.length > 0) {
      updateObj.name = String(name).trim();
    }
    if (classNum) {
      updateObj.class = String(classNum).trim();
    }
    if (fee && Math.abs(parseInt(fee)) > 0) {
      updateObj.fee = Math.abs(parseInt(fee));
    }
    if (status) {
      updateObj.status = status;
    }
    if (start_date) {
      updateObj.start_date = start_date;
    }
    if (end_date) {
      updateObj.end_date = end_date;
    }
    if (notes) {
      updateObj.notes = String(notes).trim();
    }
    if (current_schedule) {
      updateObj.current_schedule = current_schedule;
      updateObj.$addToSet = {
        schedules: current_schedule,
      };
    }

    let schedules_id_add = [];
    let schedules_id_remove = [];

    if (schedules_add instanceof String) {
      schedules_id_add = [schedules_add];
    } else if (schedules_add instanceof Array) {
      schedules_id_add = [...schedules_id_add, ...schedules_add];
    }

    if (schedules_remove instanceof String) {
      schedules_id_remove = [schedules_remove];
    } else if (schedules_remove instanceof Array) {
      schedules_id_remove = [...schedules_id_remove, ...schedules_remove];
    }

    schedules_id_add = Object.keys(
      schedules_id_add
        .filter((si) => mongoose.Types.ObjectId.isValid(si))
        .reduce((pre, curr) => {
          pre[curr] = curr;
          return pre;
        }, {})
    );
    schedules_id_remove = Object.keys(
      schedules_id_remove
        .filter((si) => mongoose.Types.ObjectId.isValid(si))
        .reduce((pre, curr) => {
          pre[curr] = curr;
          return pre;
        }, {})
    );

    if (schedules_id_add.length > 0) {
      updateObj.$addToSet = {
        schedules: { $each: schedules_id_add },
      };
    }
    if (schedules_id_remove.length > 0) {
      updateObj.$pull = {
        schedules: { $in: schedules_id_remove },
      };
    }

    const updatedStudent = await models.Student.findByIdAndUpdate(
      id,
      updateObj,
      {
        new: true,
      }
    );

    return res.status(200).json(updatedStudent);
    // return res.status(200).json(updateObj);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  deleteByID,
  updateStudent,
};
