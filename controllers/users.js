const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundUserError = require('../errors/notFoundUser');
const InvalidMailError = require('../errors/invalidMail');
const ValidationError = require('../errors/validationError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res) => {
  req.params.id = req.user._id;
  this.getUser(req, res);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundUserError())
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const er = new ValidationError();
        next(er);
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      }),
    )
    .then((user) =>
      res.send({
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      }),
    )
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const er = new Error('E-mail занят. Попробуйте другой.');
        er.statusCode = 409;
        next(er);
      } else if (err.name === 'ValidationError') {
        const er = new ValidationError();
        next(er);
      } else {
        next(err);
      }
    });
};

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundUserError())
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const er = new ValidationError();
        next(er);
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new InvalidMailError();
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new InvalidMailError();
        }
        // пароль верный
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production'
            ? JWT_SECRET
            : '5cdd183194489560b0e6bfaf8a81541e',
          { expiresIn: '7d' }, // токен будет просрочен через неделю после создания
        );
        res.send(token);
      });
    })
    .catch((err) => next(err));
};
