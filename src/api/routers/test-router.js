const express = require('express')

module.exports = function(server){

    // Definir URL base para todas as rotas
    const router = express.Router()
    
    server.use('/api', router)

    // Rotas
    const test = require('../service/test-service')
    test.register(router, '/test')
}