class NotFoundMovieError extends Error {
  constructor() {
    super('Карточка фильма не найдена');
    this.statusCode = 404;
  }
}

module.exports = NotFoundMovieError;
