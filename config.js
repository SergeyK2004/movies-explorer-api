require('dotenv').config();

const {
  PORT = 3000,
  DB_LINK = 'mongodb://localhost:27017/bitfilmsdb',
  JWT_SECRET = '5cdd183194489560b0e6bfaf8a81541e',
} = process.env;

module.exports = {
  PORT,
  DB_LINK,
  JWT_SECRET,
};
