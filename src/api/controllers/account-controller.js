const _ = require('lodash');
const jwt = require('jsonwebtoken');
const env = require('../../../.env');
const account_validations = require('../validations/account-validations');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

// Método generico que irá tratar erros de banco de dados
const sendErrorsFromDB = (res, dbErrors) => {
  const errors = [];
  _.forIn(dbErrors.errors, error => errors.push(error.message));
  return res.status(400).json({ errors });
};

const login = (req, res, next) => {
  // dados relacionados ao login
  const email = req.body.email || '';
  const password = req.body.password || '';

  // Buscando o usuário pelo email
  Usuario.findOne({ email }, (err, model) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    }
    // verifica se o usuário existe e o método compareSync verifica se a senha esta correta
    else if (model && bcrypt.compareSync(password, model.password)) {
      //gera um token definindo o tempo de expiração
      const token = jwt.sign(model, env.authSecret, {
        expiresIn: '1 hour'
      });

      res.status(200).json({
        nome: `${model.nome}`,
        email: `${model.email}`,
        token: `${token}`,
        message: 'Ok',
        success: 'true'
      });
    } else {
      return res.status(400).send({ message: 'Email ou senha inválidos', success: false });
    }
  });
};

const validateToken = (req, res, next) => {
  const token = req.headers['authorization'] || '';

  // Verifica o token passado no body da requisição e retorna uma resposta se o token está válido ou não
  jwt.verify(token, env.authSecret, function(err, decoded) {
    return res.status(200).send({ token: `${token}`, valid: `${!err}` });
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
  const errors = account_validations.validade_signup(user);

  if (errors.length < 1) {
    // verifica se o usuário já existe na base antes de cadastrar
    Usuario.findOne({ email: user.email }, (err, usuario) => {
      if (err) {
        return sendErrorsFromDB(res, err);
      }
      // se existe o usuário já devolve a resposta
      else if (usuario) {
        errors.push(Object.assign({}, {}));
        return res.status(400).json({
          errors: [{ message: 'Já existe um usuário cadastrado com esse endereço de email' }]
        });
      }
      // se não existe, então realiza o cadastro
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
              expiresIn: '1 hour'
            });

            return res.status(200).json({
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
    res.status(400).json({ errors });
  }
};

// Exportando todos os métodos criados referente ao processo de autenticação
module.exports = { login, signup, validateToken };
