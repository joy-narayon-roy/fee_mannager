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
async function getProfile(req, res, next) {
  try {
    const studentPromis = models.Student.find();
    const schedulePromis = models.Schedule.find();
    const feePromis = models.Fee.find();
    const paymentPromis = models.Payment.find();
    const [students, schedules, fees, payments] = await Promise.all([
      studentPromis,
      schedulePromis,
      feePromis,
      paymentPromis,
    ]);
    return res.status(200).json({
      students,
      schedules,
      fees,
      payments,
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
async function createProfile(req, res, next) {
  try {
    throw createError("he service is temporarily unavailable.");
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
async function updateProfile(req, res, next) {
  try {
    throw createError("he service is temporarily unavailable.");
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
async function addOrRemoveProfileID(req, res, next) {
  try {
    throw createError("he service is temporarily unavailable.");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  addOrRemoveProfileID,
};
