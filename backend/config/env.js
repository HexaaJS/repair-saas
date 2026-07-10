const path = require('path');
const dotenv = require('dotenv');

const ENV = process.env.NODE_ENV || 'development';
const envFile = `.env.${ENV}`;

dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

module.exports = {
  env: ENV,
  isDev: ENV === 'development',
  isProd: ENV === 'production',
  port: parseInt(process.env.PORT, 10) || 5000,

  mongo: {
    uri: process.env.MONGODB_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
  },

  client: {
    url: process.env.CLIENT_URL,
  },
};