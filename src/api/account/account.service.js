const randStr = require('randomstring');
const moment = require('moment');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const env = require('../../../.env');

const AccountLog = require('../../infraestrutura/mongo/models/account.log.model');

const sendEmailPasswordRecovery = (usuario) => {

    const log = new AccountLog({
        usuario: usuario.email,
        hash: randStr.generate(32),
        emailConfirmado: false,
        dtCriacao: moment().format(),
        dtConfirmacao: null,
        logTipo: 'Password Recovery'
    });

    log.save(err => {
        if (err) {
            console.log('Error');
        }
        else {
            const $from = env.gmail_account.email;
            const $passwd = env.gmail_account.password;

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
                }));

            const destinatario = usuario.email;

            var mailOptions = {
                from: $from,
                to: destinatario,
                subject: 'Wolfbot - Recuperação de Senha',
                html:
                    `<h1>Olá, ${usuario.nome}</h1>.<br />` +
                    `<h4>Link para recuperação da senha,` +
                    `<a href="http://localhost:3000/account/login"> Clique aqui para redefinir a senha</a></h4>`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email enviado' + info.response);
                }
            });
        }
    })
}

module.exports = { sendEmailPasswordRecovery };