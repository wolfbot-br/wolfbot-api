const express = require('express');
const auth = require('../../config/auth');

module.exports = function(server) {
  const account_controller = require('../controllers/account-controller');

  // definindo as rotas protegidas e rotas abertas atraves de um Router
  const rotas_protegidas = express.Router();
  const rotas_abertas = express.Router();

  // Aplicando o filtro de autenticação nas rotas protegidas pela aplicação
  rotas_protegidas.use(auth);

  // todas as requisições que vierem de /api passarão pela vilidação
  server.use('/api', rotas_protegidas);

  // todas as rotas que vierem de /account são rotas abertas para requição
  server.use('/account', rotas_abertas);

  rotas_abertas.post('/login', account_controller.login);
  rotas_abertas.post('/signup', account_controller.signup);
  rotas_abertas.post('/validateToken', account_controller.validateToken);
};
