const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
    const perfilController = require('../perfil/perfil.controller')

    const protectedRoutes = express.Router()

    protectedRoutes.use(auth)

    server.use('/api', protectedRoutes)

    protectedRoutes.get('/profile', perfilController.profile)
    protectedRoutes.put('/profile', perfilController.updateProfile)

}