const randStr = require('randomstring')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const env = require('../../../.env')
const bcrypt = require('bcrypt')

const utilService = require('../util/util.service')

const AccountLog = require('../../infraestrutura/mongo/models/account.log.model')
const Usuario = require('../../infraestrutura/mongo/models/usuario.model')

const sendEmailPasswordRecovery = (usuario, res) => {
  const hash = randStr.generate(64)
  const log = new AccountLog({
    usuario: usuario.email,
    hash: hash,
    emailConfirmado: false,
    dtCriacao: moment().subtract(3, 'hours').format(),
    dtExpiracao: moment().subtract(2, 'hours').format(),
    dtVerificacao: moment().subtract(3, 'hours').format(),
    dtConfirmacao: null,
    logTipo: 'Recuperação de Senha',
    pendente: true
  })
  log.save(err => {
    if (err) {
      return ({
        errors:
        {
          message: 'Erro ao estabelecer conexão com o mongo'
        },
        sucess: false
      })
    } else {
      const $from = env.gmail_account.email
      const $passwd = env.gmail_account.password

      var transporter = nodemailer.createTransport(
        smtpTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          service: 'Gmail',
          auth:
          {
            user: $from,
            pass: $passwd
          },
          tls: { rejectUnauthorized: false }
        }))
      const destinatario = usuario.email
      var mailOptions = {
        from: $from,
        to: destinatario,
        subject: 'Wolfbot - Recuperação de Senha',
        html:
          `<p style='text-align:center'>Wolfbot</p><br />` +
          `<p>Olá, ${usuario.nome}, esqueceu sua senha?</h3>.<br />` +
          `<p>Se você gostaria de redefinir sua senha, clique no link abaixo ou copie e cole o link no seu navegador:<br />` +
          `<a href = "http://localhost:3000/#/changepassword?parameter=${hash}">Clique aqui para redefinir a senha</a><br/>` +
          `Note que este link só pode ser usado uma vez<br />` +
          `Se você não deseja redefinir sua senha, ignore esta mensagem e sua senha não será alterada</p >`
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return ({
            errors:
            {
              message: 'Erro ao enviar o email para redefinição de senha'
            },
            sucess: false
          })
        } else {
          return res.status(200).json({
            valid: true
          })
        }
      })
    }
  })
}

const passwordRecovery = (res, next, email) => {
  if (email) {
    Usuario.findOne({ email: email }, (err, usuario) => {
      if (err) {
        return sendErrorsFromDB(res, err)
      } else if (usuario) {
        sendEmailPasswordRecovery(usuario, res)
      } else {
        return res.status(406).json({
          success: false,
          errors: { message: 'Não existe usuário cadastrado com esse email!' }
        })
      }
    })
  } else {
    return res.status(406).json({
      success: false,
      errors: { message: 'É necessário informar o email!' }
    })
  }
}

const changePasswordPermition = (res, next, hash) => {
  if (hash != undefined && hash != null) {
    findLogChangePassword(hash, res)
  } else {
    return res.status(400).json({
      success: false,
      errors: [{ message: 'Solicitação Inválida' }]
    })
  }
}

const validateToken = (res, next, token) => {

  jwt.verify(token, env.authSecret, function (err, decoded) {
    if (err) {
      return res.status(401).send({
        errors: 'Não Autorizado'
      })
    }
    const created = utilService.convertTimeStampToHours(decoded.iat)
    const exp = utilService.convertTimeStampToHours(decoded.exp)
    return res.status(200).send(
      {
        token: `${token}`,
        dateCreated: new Date(decoded.iat * 1000),
        valid: `${!err}`,
        usuario: decoded._doc,
        hourCreated: created,
        hourExpiration: exp
      })
  })
}

const login = (res, next, email, password) => {

  Usuario.findOne({ email }, (err, model) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    } else if (!(model && bcrypt.compareSync(password, model.password))) {
      return res
        .status(401)
        .json({ errors: [{ message: 'Email ou senha inválidos' }], success: false })
    } else {
      AccountLog.findOne({ usuario: email, pendente: true, dtConfirmacao: { $eq: null }, logTipo: 'Cadastro do usuário' },
        (err, log) => {
          if (err || log) {
            return res.status(400).json({
              success: false,
              errors: [{ message: 'Sua conta não foi ativada, verifique seu email.' }]
            })
          }
          else {
            const token = jwt.sign(model, env.authSecret, {
              expiresIn: '1h'
            })
            res.status(200).json({
              id: `${model.id}`,
              nome: `${model.usuario}`,
              token: `${token}`,
              message: 'Ok',
              success: 'true'
            })
          }
        }
      )
    }
  })
}

const findLogChangePassword = (ChangePasswordHash, res) => {
  AccountLog.findOne({ hash: ChangePasswordHash, pendente: true, dtConfirmacao: null, logTipo: 'Recuperação de Senha' }, (error, model) => {
    if (error) {
      return res.status(404).json({
        success: false,
        errors: [{ message: 'ChangePasswordHash não se encontra no mongo' }]
      })
    }
    if (!model) {
      return res.status(404).json({
        success: false,
        errors: [{ message: 'Solicitação Inválida' }]
      })
    } else {
      AccountLog.update({ usuario: model.usuario, hash: { $ne: model.hash } }, { pendente: false }, { multi: true },
        (error) => {
          if (error) {
            return res.status(400).json({
              success: false,
              errors: [{ message: 'Erro ao conectar com o mongo!' }]
            })
          }
          AccountLog.update({ hash: model.hash }, { dtVerificacao: moment().subtract(3, 'hours').format() }, { multi: true },
            (error) => {
              if (error) {
                return res.status(400).json({
                  success: false,
                  errors: [{ message: 'Erro ao conectar com o mongo!' }]
                })
              }
              AccountLog.findOne({ hash: ChangePasswordHash, pendente: true, dtConfirmacao: null, logTipo: 'Recuperação de Senha' }, (error, model) => {
                if (error) {
                  return res.status(404).json({
                    success: false,
                    errors: [{ message: 'Erro ao conectar com o mongo!' }]
                  })
                }
                if (model.dtVerificacao > model.dtExpiracao) {
                  return res.status(404).json({
                    success: false,
                    errors: [{ message: 'Não é mais possivel realizar a alteração da senha!' }]
                  })
                } else {
                  return res.status(200).json({
                    success: true,
                    errors: [],
                    hash: model.hash
                  })
                }
              })
            }
          )
        }
      )
    }
  })
}

const updatePassword = (log, password, res) => {
  const salt = bcrypt.genSaltSync()
  const password_encripted = bcrypt.hashSync(password, salt)
  Usuario.update({ email: log.usuario }, { password: password_encripted }, { multi: true },
    (error, response) => {
      if (error) {
        return sendErrorsFromDB(response, err)
      } else {
        return res.status(200).json({
          success: true,
          message: 'Sua senha foi alterada!'
        })
      }
    }
  )
}

const changePassword = (res, next, changePasswordHash, password) => {
  AccountLog.findOne({ hash: changePasswordHash, pendente: true }, (err, log) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    }
    if (!log) {
      return res.status(400).json({
        success: false,
        errors: [{ message: 'Solicitação Inválida! Envie o email novamente!' }]
      })
    } else {
      AccountLog.update({ usuario: log.usuario, hash: changePasswordHash }, { pendente: false }, { multi: true },
        (err, response) => {
          if (err) {
            return sendErrorsFromDB(response, err)
          } else {
            updatePassword(log, password, res)
          }
        }
      )
    }
  })
}
const activeAccount = (res, next, activeAccountHash) => {
  AccountLog.findOne({ hash: activeAccountHash, pendente: true }, (err, log) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    }
    if (!log) {
      return res.status(400).json({
        sucess: false,
        errors: [{ message: 'Sua conta já está ativada ou ocorreu um erro!' }]
      })
    }
    else {
      AccountLog.update({ usuario: log.usuario, hash: activeAccountHash },
        { pendente: false, dtConfirmacao: moment().subtract(3, 'hours').format(), emailConfirmado: true }
        , { multi: true }, (err, response) => {
          if (err) {
            return sendErrorsFromDB(response, err)
          }
          else {
            return res.status(200).json({
              sucess: true,
              errors: []
            })
          }
        })
    }
  })
}
const signup = (res, errors, user) => {
  Usuario.findOne({ email: user.email }, (err, usuario) => {
    if (err) {
      return sendErrorsFromDB(res, err)
    }
    else if (usuario) {
      errors.push(Object.assign({}, {}))
      return res.status(406).json({
        errors: [{ message: 'Já existe um usuário cadastrado com esse endereço de email' }]
      })
    }
    else {
      const novo_usuario = new Usuario({
        nome: user.nome,
        email: user.email,
        password: user.password_encripted
      })
      novo_usuario.save(err => {
        if (err) {
          return sendErrorsFromDB(res, req)
        }
        else {
          const hash = randStr.generate(64)
          const log = new AccountLog({
            usuario: novo_usuario.email,
            hash: hash,
            emailConfirmado: false,
            dtCriacao: moment().subtract(3, 'hours').format(),
            dtExpiracao: null,
            dtVerificacao: moment().subtract(3, 'hours').format(),
            dtConfirmacao: null,
            logTipo: 'Cadastro do usuário',
            pendente: true
          })
          log.save(err => {
            if (err) {
              return ({
                errors:
                {
                  message: 'Erro ao estabelecer conexão com o mongo'
                },
                sucess: false
              })
            }
            else {
              const $from = env.gmail_account.email
              const $passwd = env.gmail_account.password

              var transporter = nodemailer.createTransport(
                smtpTransport({
                  host: 'smtp.gmail.com',
                  port: 465,
                  secure: true,
                  service: 'Gmail',
                  auth:
                  {
                    user: $from,
                    pass: $passwd
                  },
                  tls: { rejectUnauthorized: false }
                }))
              const destinatario = novo_usuario.email
              var mailOptions = {
                from: $from,
                to: destinatario,
                subject: 'Wolfbot - Confirme seu email',
                html:
                  `<p style='text-align:center'>Wolfbot</p><br />` +
                  `<p>Olá, ${novo_usuario.nome}, Bem-vindo ao Wolfbot</h3>.<br />` +
                  `<p>Seja bem-vindo ao Wolfbot. Para Ativar sua conta você deve clicar no link abaixo:<br />` +
                  `<a href = "http://localhost:3000/#/login?parameter=${hash}">Ativar minha conta</a><br/></p >`
              }

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  return ({
                    errors:
                    {
                      message: 'Erro ao enviar o email para redefinição de senha'
                    },
                    sucess: false
                  })
                }
                else {
                  return res.status(200).json({
                    id: `${novo_usuario.id}`,
                    nome: `${novo_usuario.nome}`,
                    email: `${novo_usuario.email}`,
                    token: '',
                    message: 'Usuário Cadastrado',
                    success: 'true'
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = []
  _.forIn(dbErrors.errors, error => errors.push(error.message))
  return res.status(400).json({ errors })
}

module.exports =
  {
    changePasswordPermition,
    passwordRecovery,
    sendEmailPasswordRecovery,
    findLogChangePassword,
    updatePassword,
    signup,
    validateToken,
    login,
    changePassword,
    activeAccount
  }
