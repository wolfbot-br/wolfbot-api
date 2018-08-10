const randStr = require('randomstring')
const moment = require('moment')
const _ = require('lodash')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const env = require('../../../.env')
const bcrypt = require('bcrypt')

const AccountLog = require('../../infraestrutura/mongo/models/account.log.model')
const Usuario = require('../../infraestrutura/mongo/models/usuario.model')

// Realiza o envio do email em cada solicitação de recuperação de senha
const sendEmailPasswordRecovery = (usuario, res) => {
  const hash = randStr.generate(32)
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

module.exports = { sendEmailPasswordRecovery, findLogChangePassword, updatePassword }
