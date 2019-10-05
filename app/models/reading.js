const mongoose = require('mongoose');

const { Schema } = mongoose;

// create a schema
const ReadingSchema = new Schema({
  thermostat_id: String,
  tracking_number: Number,
  temperature : Number,
  humidity : Number,
  battery_charge : Number,
});

// create the model
const ReadingModel = mongoose.model('Reading', ReadingSchema);

// export the model
module.exports = ReadingModel;
