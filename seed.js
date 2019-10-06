const ThermostatModel = require("./app/models/thermostat");
const { randomString } = require("./app/helpers/utils");
require("./config/db");


const SeedHouseHoldRecords = async () => {
    const dumyRecords = Array(5).fill(0).map(r => ({
        household_token : randomString(25),
        location : 'Test location'
    }))
    const result = await ThermostatModel.insertMany(dumyRecords);
    console.log("Records are=>" , result);
    process.exit()
};


SeedHouseHoldRecords()