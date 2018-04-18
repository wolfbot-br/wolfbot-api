const express = require('express')

module.exports = function(server){

    // Definir URL base para todas as rotas
    const router = express.Router()   
    server.use('/api', router)
    
    const test_service = require('../service/test-service')

    
    // Rotas
    test_service.register(router, '/test')
}