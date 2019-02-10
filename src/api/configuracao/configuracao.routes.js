const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
  const configuracaoController = require('../configuracao/configuracao.controller')

  const protectedRoutes = express.Router()

  // protectedRoutes.use(auth)
  server.use('/api/configuracao', protectedRoutes)

  protectedRoutes.get('/carregar', configuracaoController.get)
  protectedRoutes.post('/salvar', configuracaoController.post)
  protectedRoutes.put('/alterar', configuracaoController.put)
  protectedRoutes.delete('/deletar', configuracaoController.exclusao)
}
