const router = require('express').Router(); // создали роутер
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const {
  validateUserBody,
  validateUserAuth,
} = require('../middlewares/validations');
const NotFoundError = require('../errors/notFoundError');

router.post('/signin', validateUserAuth, login);

router.post('/signup', validateUserBody, createUser);

router.use(auth);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('/', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
