/* eslint-disable const/named */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-shadow */

const express = require("express");
const { celebrate, errors } = require("celebrate");
const Joi = require("joi");
const router = express.Router();
const authMiddleware = require("../middleware/middleware");
const Boom = require("boom");
const ReadingModel = require("../models/reading");
const _ = require("lodash");
var EventEmitter = require("events");
const readingSchema = require('../schema/readingSchema');

const eventHandler = new EventEmitter();

eventHandler.on("performBackgroundTask", async body => {
  const reading = new ReadingModel({
    ...body
  });
  await reading.save();
});

// Get Content Analytics
router.post(
  "/thermostat/reading",
  authMiddleware,
  celebrate({
    body: readingSchema
  }),
  async (req, res) => {
    const {
      thermostat: { _id }
    } = req;
    const record = await ReadingModel.findOne({ thermostat_id: _id }).sort({
      tracking_number: -1
    });

    let trackingNumber = record ? record.tracking_number + 1 : 1;

    eventHandler.emit("performBackgroundTask", {
      ...req.body,
      thermostat_id: _id.toString(),
      tracking_number: trackingNumber
    });

    res.send({ success: true, status : 200 });
  }
);

router.get(
  "/thermostat/reading",
  authMiddleware,
  celebrate({
    query: {
      trackingNumber: Joi.number().required()
    }
  }),
  async (req, res, next) => {
    const {
      thermostat: { _id }
    } = req;
    const { trackingNumber } = req.query;
    const readingRecord = await ReadingModel.findOne({
      thermostat_id: _id,
      tracking_number: trackingNumber
    });

    if (!readingRecord) return next(Boom.notFound("Reading not found"));

    res.send(readingRecord);
  }
);

router.get("/thermostat/stats", authMiddleware, async (req, res, next) => {
  const {
    thermostat: { _id }
  } = req;
  const records = await ReadingModel.find({
    thermostat_id: _id
  });

  if (!records) return next(Boom.notFound("Readings not found"));

  const tempAvg = _.meanBy(records, "temperature");
  const humidityAvg = _.meanBy(records, "humidity");
  const batteryAvg = _.meanBy(records, "battery_charge");

  const tempMax = _.maxBy(records, "temperature").temperature;
  const humidityMax = _.maxBy(records, "humidity").humidity;
  const batteryMax = _.maxBy(records, "battery_charge").battery_charge;

  const tempMin = _.minBy(records, "temperature").temperature;
  const humidityMin = _.minBy(records, "humidity").humidity;
  const batteryMin = _.minBy(records, "battery_charge").battery_charge;

  console.log(batteryAvg);

  const response = {
    temperature: {
      average: tempAvg,
      max: tempMax,
      min: tempMin
    },
    humidity: {
      average: humidityAvg,
      max: humidityMax,
      min: humidityMin
    },
    battery: {
      average: batteryAvg,
      max: batteryMax,
      min: batteryMin
    }
  };
  res.send({ ...response });
});

router.use(errors());
module.exports = router;
