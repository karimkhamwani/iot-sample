const Joi = require("joi");

module.exports = {
  temperature: Joi.number().required(),
  humidity: Joi.number().required(),
  battery_charge: Joi.number().required()
};
