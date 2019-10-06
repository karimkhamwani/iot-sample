module.exports = {
  randomString(length) {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHUJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
  ERROR_MESSAGE: {
    token_not_found: "Authorization token is required",
    thermostat_not_found: "Thermostat not found"
  },
  response(res, status, message , data) {
    return res.status(status).send({ message, status, data });
  }
};
