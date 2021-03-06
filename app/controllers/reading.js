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
const readingSchema = require("../schema/readingSchema");
const { response } = require("../helpers/utils");

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

    return response(res, 200, true , null);
  }
);

router.get(
  "/thermostat/reading",
  authMiddleware,
  celebrate({
    query: {
      number: Joi.number().required()
    }
  }),
  async (req, res, next) => {
    const {
      thermostat: { _id }
    } = req;
    const { number } = req.query;
    const readingRecord = await ReadingModel.findOne({
      thermostat_id: _id,
      tracking_number: number
    });

    if (!readingRecord) return response(res , 404 , 'Reading not found' , null)

    return response(res , 200 , null , readingRecord)
  }
);

router.get("/thermostat/stats", authMiddleware, async (req, res, next) => {
  const {
    thermostat: { _id }
  } = req;

  let tempAvg = 0,
    humidityAvg = 0,
    batteryAvg = 0;

  let tempMax = 0,
    humidityMax = 0,
    batteryMax = 0;

  let tempMin = Infinity,
    humidityMin = Infinity,
    batteryMin = Infinity;

  const records = await ReadingModel.find({
    thermostat_id: _id
  });
  const totalRecords = records.length;

  if (!records) return response(res , 404 , 'Readings not found' , null)

  records.forEach(r => {
    const { temperature: temp, humidity: hum, battery_charge: charge } = r;
    tempAvg = tempAvg + temp;
    (humidityAvg = humidityAvg + hum), (batteryAvg = batteryAvg + charge);

    tempMax = tempMax < temp ? temp : tempMax;
    humidityMax = humidityMax < hum ? hum : humidityMax;
    batteryMax = batteryMax < charge ? charge : batteryMax;

    tempMin = tempMin > temp ? temp : tempMin;
    humidityMin = humidityMin > hum ? hum : humidityMin;
    batteryMin = batteryMax > charge ? charge : batteryMin;
  });

  const data = {
    temperature: {
      average: tempAvg / totalRecords,
      max: tempMax,
      min: tempMin
    },
    humidity: {
      average: humidityAvg / totalRecords,
      max: humidityMax,
      min: humidityMin
    },
    battery: {
      average: batteryAvg / totalRecords,
      max: batteryMax,
      min: batteryMin
    }
  };
  return response(res , 200 , null , data)  
});

router.use(errors());
module.exports = router;
