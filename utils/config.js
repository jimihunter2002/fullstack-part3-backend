require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;
const MONGODB_URI_END = process.env.MONGODB_URI_END;
const PORT = process.env.PORT;

module.exports = {
  MONGODB_URI,
  USERNAME,
  PASSWORD,
  MONGODB_URI_END,
  PORT,
};
