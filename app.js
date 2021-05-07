const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./middlewares/rate-limit');
const router = require('./routes/index'); // импортируем роутер
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, NODE_ENV, DB_LINK } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();

mongoose.connect(
  NODE_ENV === 'production' ? DB_LINK : 'mongodb://localhost:27017/bitfilmsdb',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
);

app.use(helmet()); // используем автоматическое проставление заголовков безопасности
app.use(limiter); // подключим защиту от DDOS  ограничив запросы с одного IP
app.use(requestLogger); // подключаем логгер запросов
app.use('/', router); // перенаправим все на центральный роутер
app.use(errorLogger); // подключаем логгер ошибок

// перехватим ошибки от Joi
app.use(errors());

app.use((err, req, res, next) => {
  // это обработчик ошибки
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT);
