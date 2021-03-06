const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

// config
const config = require("./config/config");
const { response } = require("./app/helpers/utils");

// database config
require("./config/db");

app.use(logger(config.isProd ? "combined" : "dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// bootstrap routes
require("./app/routes")(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  return next(response(res, 404, "Route not found", null));
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message,
      data: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message,
    data: null
  });
});
app.listen(config.server.port);
console.log(`Magic happens on port ${config.server.port}`);
module.exports = app;
