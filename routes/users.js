const router = require('express').Router();

const { getUser, getCurrentUser, patchUser } = require('../controllers/users');
const {
  validateUserInfo,
  validateObjectId,
} = require('../middlewares/validations');

router.get('/me', getCurrentUser);

router.get('/me/:id', validateObjectId, getUser);

router.patch('/me', validateUserInfo, patchUser);

module.exports = router;
