const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new Error('Необходима авторизация');
    err.statusCode = 401;
    next(err);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production'
        ? JWT_SECRET
        : '5cdd183194489560b0e6bfaf8a81541e',
    );
  } catch (err) {
    err.message = 'Ошибка авторизации';
    err.statusCode = 401;
    next(err);
  }

  req.user = payload;
  next();
};
