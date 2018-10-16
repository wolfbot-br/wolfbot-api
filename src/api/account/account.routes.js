const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
  const accountController = require('../account/account.controller')

  const protectedRoutes = express.Router()
  const openRoutes = express.Router()

  protectedRoutes.use(auth)

  server.use('/api', protectedRoutes)
  server.use('/account', openRoutes)

  openRoutes.get('/validateToken', accountController.validateToken)
  openRoutes.post('/passwordRecovery', accountController.passwordRecovery)
  openRoutes.post('/changepasswordpermition', accountController.changePasswordPermition)
  openRoutes.post('/changepassword', accountController.changePassword)
  openRoutes.post('/active', accountController.activeAccount)

  // NEW ROUTER FIREBASE
  openRoutes.post('/createtoken', accountController.createToken)
  openRoutes.get('/getuserbyemail', accountController.getUserByEmail)
  openRoutes.post('/login', accountController.login)
  openRoutes.post('/signup', accountController.signup)
  openRoutes.get('/me', accountController.me)
}
