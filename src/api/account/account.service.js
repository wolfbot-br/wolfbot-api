const randStr = require('randomstring');
const moment = require('moment');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const env = require('../../../.env');

const AccountLog = require('../../infraestrutura/mongo/models/account.log.model');

const sendEmailPasswordRecovery = (usuario, res) => {

    const hash = randStr.generate(32);
    const log = new AccountLog({
        usuario: usuario.email,
        hash: hash,
        emailConfirmado: false,
        dtCriacao: moment().format(),
        dtConfirmacao: null,
        logTipo: 'Recuperação de Senha',
        pendente: true
    });

    log.save(err => {
        if (err) {
            return ({
                errors:
                {
                    message: 'Erro ao estabelecer conexão com o mongo'
                },
                sucess: false
            });
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
                    `<h2 style='text-align:center'>Wolfbot</h2><br />` +
                    `<h3>Olá, ${usuario.nome}, esqueceu sua senha?</h3>.<br />` +
                    `<h3>Se você gostaria de redefinir sua senha, clique no link abaixo ou copie e cole o link no seu navegador:<br />` +
                    `<a href = "http://localhost:3000/#/changepassword?parameter=${hash}"Clique aqui para redefinir a senha</a><br/>` +
                    `Note que este link só pode ser usado uma vez><br />` +
                    `Se você não deseja redefinir sua senha, ignore esta mensagem e sua senha não será alterada</h3 >`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return ({
                        errors:
                        {
                            message: 'Erro ao enviar o email para redefinição de senha'
                        },
                        sucess: false
                    });
                }
                else {
                    return res.status(200).json({
                        valid: true
                    });
                }
            });
        }
    })
}

module.exports = { sendEmailPasswordRecovery };