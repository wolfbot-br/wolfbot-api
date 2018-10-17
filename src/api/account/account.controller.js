const _ = require('lodash')
const bcrypt = require('bcrypt')

const accountValidation = require('../account/account.validation')
const accountService = require('../account/account.service')

const validateToken = (req, res, next) => {
  const token = req.headers['authorization'] || ''
  accountService.validateToken(res, next, token)
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



// Firebase new Auth

const activeAccount = (req, res) => {
  const code = req.headers['code']
  if (!code) {
    return res.status(400).json({
      errors: [{ message: '"code" na requisição é obrigatório' }]
    })
  }
  accountService.activeAccount(res, code)
}

const getUserByEmail = (req, res) => {
  const email = req.headers['email']
  accountService.getUserByEmail(email, res)
}

const me = (req, res) => {
  const token = req.headers['token']
  accountService.me(res, token)
}

const signup = (req, res) => {
  const usuario = {
    nome: req.body.nome || '',
    email: req.body.email || '',
    password: req.body.password || '',
    confirm_password: req.body.confirm_password || ''
  }

  const errors = accountValidation.validade_signup(usuario)

  if (errors.length > 0) {
    res.status(406).json({ errors })
  }
  else {
    accountService.signup(res, usuario)
  }
}

const createToken = (req, res) => {
  const email = req.body.email || ''
  const password = req.body.password || ''
  const errors = accountValidation.validade_login(email, password)
  if (errors.length > 0) {
    res.status(406).json({ errors })
  }
  else {
    accountService.createToken(email, password, res)
  }
}

const login = (req, res) => {
  const email = req.body.email || ''
  const password = req.body.password || ''
  const errors = accountValidation.validade_login(email, password)
  if (errors.length > 0) {
    res.status(406).json({ errors })
  }
  else {
    accountService.login(res, email, password)
  }
}

module.exports =
  {
    login,
    createToken,
    signup,
    me,
    validateToken,
    passwordRecovery,
    changePasswordPermition,
    changePassword,
    activeAccount,
    getUserByEmail
  }
