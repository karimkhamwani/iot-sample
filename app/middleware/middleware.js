const Thermostat = require("../models/thermostat");
const { ERROR_MESSAGE, response } = require("../helpers/utils");
/**
 * Check if token provided to route and is valid token
 * pass then call next middleware otherwise throw error
 * @param {object} req request body
 * @param {object} res response body
 * @function async
 * @return {json}}} return error in json or pass requet to next middleware
 */
const authenticationMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return response(res, 401, ERROR_MESSAGE.token_not_found);

  const thermostat = await Thermostat.findOne({ household_token: authorization });
  if (!thermostat)
    return response(res, 404, ERROR_MESSAGE.thermostat_not_found);

  req.thermostat = thermostat;
  next();
};

module.exports = authenticationMiddleware;
