const jwt = require('jsonwebtoken');

// *****************************************
// token verification middleware
// *****************************************
function jwtDecode(req, res, next) {
  const { authorization } = req.headers;
  try {
    if (!authorization) throw new Error('no Authorization header found');

    const [bearer, token] = authorization.split(' ');

    if (bearer === 'Bearer' && token) {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;
      next();
    }
  } catch (error) {
    res.status(403);
    next(error);
  }
}

function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  // console.log('status', res.statusCode);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  // eslint-disable-next-line no-console
  console.log(err);
  res.send({
    message: err.message,
    /* details: err.meta.details, */
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}

module.exports = {
  notFound,
  errorHandler,
  jwtDecode,
};
