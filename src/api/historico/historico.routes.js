const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
  const historicoController = require('../historico/historico.controller')

  const protectedRoutes = express.Router()

  protectedRoutes.use(auth)
  server.use('/api', protectedRoutes)

  protectedRoutes.get('/historicos', historicoController.historicos)
}
