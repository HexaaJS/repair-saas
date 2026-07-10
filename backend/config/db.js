const mongoose = require('mongoose');
const { mongo, env, isDev } = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongo.uri);
    console.log(`📦 MongoDB connecté : ${conn.connection.name} [${env.toUpperCase()}]`);

    if (isDev) {
      mongoose.set('debug', true);
    }
  } catch (error) {
    console.error(`❌ Erreur MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;