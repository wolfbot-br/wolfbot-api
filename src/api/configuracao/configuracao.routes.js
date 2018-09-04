const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
  const configuracaoController = require('../configuracao/configuracao.controller')

  const protectedRoutes = express.Router()
  const openRoutes = express.Router()

  protectedRoutes.use(auth)

  server.use('/api', protectedRoutes)
  server.use('/configuracao', openRoutes)

  openRoutes.get('/carregar', configuracaoController.get)
  openRoutes.post('/salvar', configuracaoController.post)
  openRoutes.put('/alterar', configuracaoController.put)
  openRoutes.delete('/deletar', configuracaoController.exclusao)
}
