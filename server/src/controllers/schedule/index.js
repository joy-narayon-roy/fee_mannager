const { default: mongoose } = require("mongoose");
const models = require("../../models");
const { createError } = require("../../tools");

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getSchedules(req, res, next) {
  try {
    let { limit, page } = req.query;
    limit = parseInt(limit) || 100;
    page = (parseInt(page) || 1) - 1;

    const total_promis = models.Schedule.countDocuments();
    const schedules_promis = models.Schedule.find()
      .limit(limit)
      .skip(limit * page);

    const [total, schedules] = await Promise.all([
      total_promis,
      schedules_promis,
    ]);

    return res.status(200).json({
      total,
      page: page + 1,
      limit,
      schedules,
    });
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
async function getScheduleById(req, res, next) {
  try {
    const { id } = req.params;

    const schedule = await models.Schedule.findById(id).populate("students");

    return res.status(200).json(schedule);
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
async function createSchedule(req, res, next) {
  try {
    if (!req.body) {
      throw createError("Provide infomation to create schedule!", 400);
    }
    const { students = [], name, days, is_active, note } = req.body;
    const schedule = new models.Schedule({ name, days, is_active, note });

    if (students.length > 0) {
      schedule._assignToStudents = students;
      // await models.Student.updateMany(
      //   {
      //     _id: { $in: students },
      //   },
      //   {
      //     current_schedule: schedule.id,
      //     $addToSet: {
      //       schedules: schedule.id,
      //     },
      //   }
      // );
    }
    await schedule.save();
    return res.status(200).json(schedule);
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
async function updateSchedule(req, res, next) {
  try {
    if (!req.body) {
      throw createError("Provide info to update!", 400);
    }
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Invalid schedule id!", 400);
    }

    const { name, is_active, days, note } = req.body;
    const newSchedule = new models.Schedule({
      name,
      is_active: Boolean(is_active),
      days,
      note,
    });
    await newSchedule.validate();

    const updatedSchedule = await models.Schedule.findByIdAndUpdate(
      id,
      {
        name,
        is_active: Boolean(is_active),
        days,
        note,
      },
      { new: true }
    );

    return res.status(200).json(updatedSchedule);
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
async function deleteSchedule(req, res, next) {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw createError("Invalid schedule id. Faild to delete!", 400);
    }
    const deleted = await models.Schedule.findByIdAndDelete(id);
    // const deleted = await
    return res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
