const server = require('./config/server')
require('./infrastructure/mongoose/index')
require('./api/routers/test-router')(server)