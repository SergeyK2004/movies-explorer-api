const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(30),
      director: Joi.string().required().min(2).max(30),
      duration: Joi.number().required().min(2).max(360),
      year: Joi.string().required().min(2).max(4),
      description: Joi.string().required().min(2).max(200),
      nameRU: Joi.string().required().min(2).max(30),
      nameEN: Joi.string().required().min(2).max(30),
      trailer: Joi.string()
        .required()
        .pattern(
          new RegExp(
            /^((http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.)+[A-Za-zА-Яа-я0-9-]{2,8}(([\w\-._~:/?#[\]@!$&'()*+,;=])*)/,
          ),
        ),
      thumbnail: Joi.string()
        .required()
        .pattern(
          new RegExp(
            /^((http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.)+[A-Za-zА-Яа-я0-9-]{2,8}(([\w\-._~:/?#[\]@!$&'()*+,;=])*)/,
          ),
        ),
      image: Joi.string()
        .required()
        .pattern(
          new RegExp(
            /^((http|https):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.)+[A-Za-zА-Яа-я0-9-]{2,8}(([\w\-._~:/?#[\]@!$&'()*+,;=])*)/,
          ),
        ),
      owner: Joi.string().hex().length(24),
      movieId: Joi.string().hex().length(24),
    }),
  }),
  createMovie,
);

router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = router;
