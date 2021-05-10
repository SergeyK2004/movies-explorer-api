class InvalidMailError extends Error {
  constructor() {
    super('Неправильные почта или пароль');
    this.statusCode = 401;
  }
}

module.exports = InvalidMailError;
