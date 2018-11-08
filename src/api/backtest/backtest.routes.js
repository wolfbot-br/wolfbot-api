const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
  const backtestController = require('../backtest/backtest.controller')

  const protectedRoutes = express.Router()

  //protectedRoutes.use(auth);
  server.use('/api', protectedRoutes)

  protectedRoutes.post('/backtest/testarConfiguracao', backtestController.testarConfiguracao)
}
