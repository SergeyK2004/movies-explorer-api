const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const InvalidMailError = require('../errors/invalidMail');
const ValidationError = require('../errors/validationError');
const { JWT_SECRET } = require('../config');
const ConflictError = require('../errors/conflictError');

module.exports.getCurrentUser = (req, res) => {
  req.params.id = req.user._id;
  this.getUser(req, res);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError('Пользователь не найден'))
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
        next(new ConflictError('E-mail занят. Попробуйте другой.'));
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
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('E-mail занят. Попробуйте другой.'));
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
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
          JWT_SECRET,
          { expiresIn: '7d' }, // токен будет просрочен через неделю после создания
        );
        res.send({ data: token });
      });
    })
    .catch((err) => next(err));
};
