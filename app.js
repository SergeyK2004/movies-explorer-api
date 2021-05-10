const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { limiter } = require('./middlewares/rate-limit');
const router = require('./routes/index'); // импортируем роутер
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_LINK, PORT } = require('./config');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_LINK, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger); // подключаем логгер запросов
app.use(limiter); // подключим защиту от DDOS  ограничив запросы с одного IP
app.use(helmet()); // используем автоматическое проставление заголовков безопасности
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
