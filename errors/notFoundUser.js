class NotFoundUserError extends Error {
  constructor() {
    super('Пользователь не найден');
    this.statusCode = 404;
  }
}

module.exports = NotFoundUserError;
