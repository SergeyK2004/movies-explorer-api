const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUser, getCurrentUser, patchUser } = require('../controllers/users');

router.get('/me', getCurrentUser);

router.get(
  '/me',
  celebrate({
    // проверим id пользователя, это строка, например 606a093828920b34947b839f
    params: Joi.object().keys({
      id: Joi.string().hex().length(24),
    }),
  }),
  getUser,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().min(2).max(30),
    }),
  }),
  patchUser,
);

module.exports = router;
