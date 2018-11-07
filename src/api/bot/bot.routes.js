const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
    const botController = require('../bot/bot.controller')

    const protectedRoutes = express.Router()

    // protectedRoutes.use(auth)
    server.use('/bot', protectedRoutes)

    protectedRoutes.post('/acionarRobo', botController.acionarRobo)
}
