const NotFoundMovieError = require('../errors/notFoundMovie');
const Movie = require('../models/movie');
const ValidationError = require('../errors/validationError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};
module.exports.getMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundMovieError())
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
  Movie.findById(req.params.cardId)
    .orFail(new NotFoundMovieError())
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .orFail(new NotFoundMovieError())
          .then((foundedMovie) => res.send({ data: foundedMovie }))
          .catch((err) => {
            if (err.name === 'ValidationError' || err.name === 'CastError') {
              const er = new ValidationError();
              next(er);
            } else {
              next(err);
            }
          });
      } else {
        const err = new Error('Нельзя удалять чужой фильм');
        err.statusCode = 403;
        throw err;
      }
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
