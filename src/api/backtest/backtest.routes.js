const express = require('express')

module.exports = function (server) {
  const backtestController = require('../backtest/backtest.controller')

  const protectedRoutes = express.Router()
  const openRoutes = express.Router()

  // protectedRoutes.use(auth);

  server.use('/backtest', openRoutes)
  openRoutes.post('/testarConfiguracao', backtestController.testarConfiguracao)
}
