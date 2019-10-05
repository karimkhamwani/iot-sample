/* eslint-disable global-require, func-names */

module.exports = function (app) {
  app.use('/', require('./controllers/thermostat'));
  app.use('/', require('./controllers/reading'));
};
