const { createError } = require("../../tools");
const models = require("../../models");

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function getPayments(req, res, next) {
  try {
    let { limit = 100, page = 1 } = req.query;
    limit = Math.abs(parseInt(limit) || 100);
    page = Math.abs(parseInt(page) || 1) - 1;

    const total = await models.Payment.countDocuments({});

    const payment = await models.Payment.find(
      {},
      {},
      {
        limit,
        skip: limit * page,
      }
    );

    return res.status(200).json({ total, page, limit, payment });
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
async function getPaymentById(req, res, next) {
  try {
    let { id } = req.params;

    const payment = await models.Payment.findById(id)
      .populate("student")
      .populate("fees.fee");
    return res.status(200).json(payment);
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
async function createPayment(req, res, next) {
  try {
    if (!req.body) {
      throw createError("Provide infomation to create payment!", 400);
    }
    const { amount, student } = req.body;
    const amount_number = parseInt(amount);

    if (isNaN(amount_number)) {
      throw createError("Provide amount!", 400);
    }
    const payment = await models.Payment.payRemainingDues(
      student,
      amount_number
    );
    // await payment.save();
    return res.status(200).json(payment);
  } catch (err) {
    next(err);
  }
}

module.exports = { getPayments, getPaymentById, createPayment };
