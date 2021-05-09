const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  validateMovieBody,
  validateObjectId,
} = require('../middlewares/validations');

router.get('/', getMovies);

router.post('/', validateMovieBody, createMovie);

router.delete('/:id', validateObjectId, deleteMovie);

module.exports = router;
