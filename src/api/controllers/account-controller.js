const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const env = require('../../../.env');

// Expressões regulares para validar email e senha
const emailRegex = /\S+@\S+\.\S+/;
//const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

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
        expiresIn: '1 day'
      });

      res.status(200).json({
        nome: `${model.nome}`,
        email: `${model.email}`,
        token: `${token}`,
        message: 'Ok',
        success: 'true'
      });
    } else {
      return res.status(400).send({ success: false, message: 'Usuário/Senha Inválidos' });
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
  // dados relacionados ao cadastro
  const nome = req.body.nome || '';
  const email = req.body.email || '';
  const password = req.body.password || '';
  const confirmPassword = req.body.confirm_password || '';

  //realiza a validação do e-mail
  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ['O e-mail informado está inválido'] });
  }

  const salt = bcrypt.genSaltSync();

  // irá criptografar a senha que o usuário informou no cadastro
  const passwordHash = bcrypt.hashSync(password, salt);

  // criptografa a senha de confirmação e já realiza a comparação com a passwordHash
  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({ errors: ['Senhas não conferem'] });
  }

  // verifica se o usuário já existe na base antes de cadastrar
  Usuario.findOne({ email }, (err, usuario) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    }
    // se existe usuário já devolve a resposta
    else if (usuario) {
      return res.status(400).send({ errors: ['Usuário já cadastrado'] });
    }
    // não existe, realiza o processo de cadastro
    else {
      const novo_usuario = new Usuario({ nome, email, password: passwordHash });
      novo_usuario.save(err => {
        if (err) {
          return sendErrorsFromDB(res, req);
        }
        // Realizou o cadastro com sucesso
        else {
          return res.status(200).send({ message: ['Usuário cadastrado com sucesso'] });
        }
      });
    }
  });
};

// Exportando todos os métodos criados referente ao processo de autenticação
module.exports = { login, signup, validateToken };
