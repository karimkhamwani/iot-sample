const Boom = require('Boom')
const Thermostat = require('../models/thermostat')

const authenticationMiddleware = async(req, res, next) => {
  const { token } = req.headers
  if(!token) return next(Boom.badRequest('Authorization token is required'))
  const thermostat = await Thermostat.findOne({ household_token : token })
  console.log(thermostat);
  if(!thermostat) return next(Boom.notFound('Thermostat not found'));
  req.thermostat = thermostat
  next();
};


module.exports = authenticationMiddleware;
