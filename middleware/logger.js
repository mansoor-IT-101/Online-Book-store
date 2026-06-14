// middleware/logger.js
// Logs every incoming request: method, endpoint, date/time

const logger = (req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}]  ${req.method}  ${req.originalUrl}`);
  next(); // pass control to the next middleware/route
};

module.exports = logger;
