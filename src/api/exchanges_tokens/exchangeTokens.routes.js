const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
  const exchangeTokensController = require('../exchanges_tokens/exchangeTokens.controller')

  const protectedRoutes = express.Router()
  const openRoutes = express.Router()

  protectedRoutes.use(auth)

  server.use('/api', protectedRoutes)
  server.use('/exchangeTokens', openRoutes)

  openRoutes.get('/', exchangeTokensController.index)
  openRoutes.post('/', exchangeTokensController.post)
  openRoutes.put('/', exchangeTokensController.put)
  openRoutes.delete('/', exchangeTokensController.exclusao)
}
