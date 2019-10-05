const express = require("express");

const router = express.Router();
const Joi = require("joi");

const ThermostatModel = require("../models/thermostat");
const Utils = require("../helpers/utils");
const { errors, celebrate } = require("celebrate");
const to = require("await-to-js").default
const Boom = require("boom");

// get home page
router.post(
  "/thermostat",
  celebrate({
    body: {
      location: Joi.string().required()
    }
  }),
  async (req, res, next) => {
    const { location } = req.body;
    const houseToken = Utils.randomString(25);
    const thermostat = new ThermostatModel({
      household_token: houseToken,
      location
    });
    const [err, result] = await to(thermostat.save());
    if (err) return Boom.internal('Error saving in database');
    const { household_token: token } = result;
    res.send({ message: "Thermostat added succesfully", token });
  }
);

router.use(errors());
module.exports = router;
