class ValidationError extends Error {
  constructor() {
    super('Переданы некорректные данные');
    this.statusCode = 400;
  }
}

module.exports = ValidationError;
