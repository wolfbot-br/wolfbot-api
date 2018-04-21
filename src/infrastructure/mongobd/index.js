const mongoose = require('mongoose')
const config = require('../../config/development')

mongoose.Promise = global.Promise

module.exports = mongoose.connect(`mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.connection}/${config.mongo.database}`,
{auth:{authdb:"admin"}})