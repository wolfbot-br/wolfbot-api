const mongoose = require('mongoose')
const env = require('../../../.env')

mongoose.Promise = global.Promise

module.exports = mongoose.connect(
  `mongodb://${env.mongo_development.connection}/${env.mongo_development.database}`,
  {
    auth: { authdb: 'admin' },
    user: `${env.mongo_development.username}`,
    pass: `${env.mongo_development.password}`,
    useMongoClient: true
  }
)
