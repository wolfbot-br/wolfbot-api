const mongoose = require('mongoose');
const env = require('../../../.env');

mongoose.Promise = global.Promise;

module.exports = mongoose.connect(
  `mongodb://${env.mongo_development.username}:${env.mongo_development.password}@${
  env.mongo_development.connection
  }/${env.mongo_development.database}`,
  { auth: { authdb: 'admin' } }
);
