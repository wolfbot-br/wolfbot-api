const express = require('express');
const auth = require('../../config/auth');

module.exports = function (server) {
  const accountController = require('../account/account.controller');

  const protectedRoutes = express.Router();
  const openRoutes = express.Router();

  // Aplicando o filtro de autenticação nas rotas protegidas pela aplicação
  protectedRoutes.use(auth);

  // todas as requisições que vierem de /api passarão pela vilidação
  server.use('/api', protectedRoutes);

  // todas as rotas que vierem de /account são rotas abertas para requição
  server.use('/account', openRoutes);

  openRoutes.post('/login', accountController.login);
  openRoutes.post('/signup', accountController.signup);
  openRoutes.post('/validateToken', accountController.validateToken);
  openRoutes.post('/passwordRecovery', accountController.passwordRecovery);
};
