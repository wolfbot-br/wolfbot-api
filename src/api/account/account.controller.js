const _ = require('lodash');
const jwt = require('jsonwebtoken');
const env = require('../../../.env');
const bcrypt = require('bcrypt');
const moment = require('moment');

const Usuario = require('../../infraestrutura/mongo/models/usuario.model');
const accountValidation = require('../account/account.validation');
const accountService = require('../account/account.service');
const AccountLog = require('../../infraestrutura/mongo/models/account.log.model');

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = [];
  _.forIn(dbErrors.errors, error => errors.push(error.message));
  return res.status(400).json({ errors });
};

const validateToken = (req, res, next) => {
  const token = req.headers['authorization'] || '';
  jwt.verify(token, env.authSecret, function (err, decoded) {
    return res.status(200).send({ token: `${token}`, valid: `${!err}` });
  });
};

const login = (req, res, next) => {

  const email = req.body.email || '';
  const password = req.body.password || '';

  Usuario.findOne({ email }, (err, model) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    }
    else if (model && bcrypt.compareSync(password, model.password)) {
      const token = jwt.sign(model, env.authSecret, {
        expiresIn: '1h'
      });

      res.status(200).json({
        id: `${model.id}`,
        nome: `${model.nome}`,
        email: `${model.email}`,
        token: `${token}`,
        message: 'Ok',
        success: 'true'
      });
    } else {
      return res
        .status(401)
        .json({ errors: [{ message: 'Email ou senha inválidos' }], success: false });
    }
  });
};

const signup = (req, res, next) => {
  let user = {
    nome: req.body.nome || '',
    email: req.body.email || '',
    password: req.body.password || '',
    confirm_password: req.body.confirm_password || '',
    password_encripted: ''
  };

  const salt = bcrypt.genSaltSync();
  user.password_encripted = bcrypt.hashSync(user.password, salt);
  const errors = accountValidation.validade_signup(user);

  if (errors.length < 1) {

    Usuario.findOne({ email: user.email }, (err, usuario) => {
      if (err) {
        return sendErrorsFromDB(res, err);
      }
      else if (usuario) {
        errors.push(Object.assign({}, {}));
        return res.status(406).json({
          errors: [{ message: 'Já existe um usuário cadastrado com esse endereço de email' }]
        });
      }
      else {
        const novo_usuario = new Usuario({
          nome: user.nome,
          email: user.email,
          password: user.password_encripted
        });
        novo_usuario.save(err => {
          if (err) {
            return sendErrorsFromDB(res, req);
          } else {
            const token = jwt.sign(novo_usuario, env.authSecret, {
              expiresIn: '1h'
            });
            return res.status(200).json({
              id: `${novo_usuario.id}`,
              nome: `${novo_usuario.nome}`,
              email: `${novo_usuario.email}`,
              token: `${token}`,
              message: 'Usuário Cadastrado',
              success: 'true'
            });
          }
        });
      }
    });
  } else {
    res.status(406).json({ errors });
  }
};

const passwordRecovery = (req, res, next) => {
  const email = req.body.email;
  if (email) {
    Usuario.findOne({ email: email }, (err, usuario) => {
      if (err) {
        return sendErrorsFromDB(res, err);
      }
      else if (usuario) {
        accountService.sendEmailPasswordRecovery(usuario, res);
      }
      else {
        return res.status(406).json({
          success: false,
          errors: { message: 'Não existe usuário cadastrado com esse email!' }
        });
      }
    });
  }
  else {
    return res.status(406).json({
      success: false,
      errors: { message: 'É necessário informar o email!' }
    });
  }
};

const changePasswordPermition = (req, res, next) => {
  const hash = req.body.changepasswordhash;
  if (hash != undefined && hash != null) {
    accountService.findLogChangePassword(hash, res);
  }
  else {
    return res.status(400).json({
      success: false,
      errors: [{ message: 'Solicitação Inválida' }]
    });
  }
};

const changePassword = (req, res, next) => {
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const changePasswordHash = req.body.changePasswordHash;
  let errors = accountValidation.changePasswordValidation(password, passwordConfirm, changePasswordHash);
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors
    });
  }
  else {
    AccountLog.findOne({ hash: changePasswordHash, pendente: true }, (err, log) => {
      if (err) {
        return sendErrorsFromDB(res, err);
      }
      if (!log) {
        return res.status(400).json({
          success: false,
          errors: [{ message: 'Solicitação Inválida! Envie o email novamente!' }]
        })
      }
      else {
        AccountLog.update({ usuario: log.usuario, hash: changePasswordHash }, { pendente: false }, { multi: true },
          (error, response) => {
            if (err) {
              return sendErrorsFromDB(response, err);
            }
            else {
              accountService.updatePassword(log, password, res);
            }
          }
        )
      }
    })
  }
};

module.exports =
  {
    login,
    signup,
    validateToken,
    passwordRecovery,
    changePasswordPermition,
    changePassword
  };
