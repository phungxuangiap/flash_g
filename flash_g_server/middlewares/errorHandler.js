const { Constants } = require("./constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case Constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Error !",
        message: err.message,
        stacktrace: err.stack,
      });
      break;
    case Constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized !",
        message: err.message,
        stacktrace: err.stack,
      });
      break;
    case Constants.FORBIDDEN:
      res.json({
        title: "Forbidden !",
        message: err.message,
        stacktrace: err.stack,
      });
      break;
    case Constants.NOT_FOUND:
      res.json({
        title: "Not found !",
        message: err.message,
        stacktrace: err.stack,
      });
      break;
    case Constants.SERVER_ERROR:
      res.json({
        title: "Server error !",
        message: err.message,
        stacktrace: err.stacktrace,
      });
      break;
    default:
      console.log("All are fine !");
      break;
  }
};
module.exports = errorHandler;
