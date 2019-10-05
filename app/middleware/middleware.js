const Boom = require("Boom");
const Thermostat = require("../models/thermostat");
const { ERROR_MESSAGE } = require("../helpers/utils");
/**
 * Check if token provided to route and is valid token
 * pass then call next middleware otherwise throw error
 * @param {object} req request body
 * @param {object} res response body
 * @function async
 * @return {json}}} return error in json or pass requet to next middleware
 */
const authenticationMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) return next(Boom.badRequest(ERROR_MESSAGE.token_not_found));

  const thermostat = await Thermostat.findOne({ household_token: token });
  if (!thermostat)
    return res
      .status(404)
      .send({ message: ERROR_MESSAGE.thermostat_not_found, status: 404 });
      
  req.thermostat = thermostat;
  next();
};

module.exports = authenticationMiddleware;
