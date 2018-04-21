const server = require('./config/server')
require('./infrastructure/mongoose/index')
require('./api/routes/test-routes')(server)