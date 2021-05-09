const Movie = require('../models/movie');
const ValidationError = require('../errors/validationError');
const AlienMovie = require('../errors/alienMovie');
const NotFoundError = require('../errors/notFoundError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};
module.exports.getMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Карточка фильма не найдена'))
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const er = new ValidationError();
        next(er);
      } else {
        next(err);
      }
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const er = new ValidationError();
        next(er);
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new NotFoundError('Карточка фильма не найдена'))
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        return movie.remove()
          .then(() => res.send({ data: movie }));
      }
      throw new AlienMovie();
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const er = new ValidationError();
        next(er);
      } else {
        next(err);
      }
    });
};
