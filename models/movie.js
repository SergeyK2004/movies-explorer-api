const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: (props) => `${props.value} некорректная ссылка`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: (props) => `${props.value} некорректная ссылка`,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: (props) => `${props.value} некорректная ссылка`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('movie', cardSchema);
