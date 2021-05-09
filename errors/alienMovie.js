class AlienMovie extends Error {
  constructor() {
    super('Нельзя удалять чужой фильм');
    this.statusCode = 403;
  }
}

module.exports = AlienMovie;
