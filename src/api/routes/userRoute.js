const express = require('express')

module.exports = function(server){

    //API routes
    const router = express.Router()
    server.use('/api', router)

    //Usuarios Routes
    const userController = require('../controllers/userController')
    userController.register(router, '/users')
}