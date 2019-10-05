const mongoose = require('mongoose');

const { Schema } = mongoose;

// create a schema
const ThermostatSchema = new Schema({
  household_token: String,
  location: String,
});

// create the model
const ThermostatModel = mongoose.model('Thermostat', ThermostatSchema);

// export the model
module.exports = ThermostatModel;
