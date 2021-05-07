const router = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');

router.use('/users', auth, require('./users'));

router.use('/movies', auth, require('./movies'));

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

router.use('/', (req, res, next) => {
  const err = new Error('PageNotFound');
  err.statusCode = 404;
  next(err);
});

module.exports = router;
