const _ = require('lodash')
const bcrypt = require('bcrypt')

const accountValidation = require('../account/account.validation')
const accountService = require('../account/account.service')

const validateToken = (req, res, next) => {
  const token = req.headers['authorization'] || ''
  accountService.validateToken(res, next, token)
}

const login = (req, res, next) => {
  const email = req.body.email || ''
  const password = req.body.password || ''
  accountService.login(res, next, email, password)
}

const signup = (req, res, next) => {
  let user = {
    nome: req.body.nome || '',
    email: req.body.email || '',
    password: req.body.password || '',
    confirm_password: req.body.confirm_password || '',
    password_encripted: ''
  }
  const salt = bcrypt.genSaltSync()
  user.password_encripted = bcrypt.hashSync(user.password, salt)
  const errors = accountValidation.validade_signup(user)

  if (errors.length < 1) {
    accountService.signup(res, errors, user);
  } else {
    res.status(406).json({ errors })
  }
}

const passwordRecovery = (req, res, next) => {
  const email = req.body.email
  accountService.passwordRecovery(res, next, email)
}

const changePasswordPermition = (req, res, next) => {
  const hash = req.body.changepasswordhash
  accountService.changePasswordPermition(res, next, hash)
}

const changePassword = (req, res, next) => {
  const password = req.body.password
  const passwordConfirm = req.body.passwordConfirm
  const changePasswordHash = req.body.changePasswordHash
  let errors = accountValidation.changePasswordValidation(password, passwordConfirm, changePasswordHash)
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors
    })
  } else {
    accountService.changePassword(res, next, changePasswordHash, password)
  }
}

const activeAccount = (req, res, next) => {
  const activeAccountHash = req.body.activeAccountHash
  accountService.activeAccount(res, next, activeAccountHash)
}

module.exports =
  {
    login,
    signup,
    validateToken,
    passwordRecovery,
    changePasswordPermition,
    changePassword,
    activeAccount
  }
