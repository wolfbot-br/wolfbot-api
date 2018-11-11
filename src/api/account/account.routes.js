const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
  const accountController = require('../account/account.controller')

  const protectedRoutes = express.Router()
  const openRoutes = express.Router()

  protectedRoutes.use(auth)

  server.use('/api', protectedRoutes)
  server.use('/account', openRoutes)

  protectedRoutes.get('/me', accountController.me)

  openRoutes.post('/createtoken', accountController.createToken)
  openRoutes.get('/getuserbyemail', accountController.getUserByEmail)
  openRoutes.post('/login', accountController.login)
  openRoutes.post('/signup', accountController.signup)
  openRoutes.get('/active', accountController.activeAccount)
}
