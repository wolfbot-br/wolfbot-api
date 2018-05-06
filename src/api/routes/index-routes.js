const express = require('express');
const auth = require('../../config/auth');

module.exports = function(server) {
  const index_controller = require('../controllers/index-controller');

  const rotas_protegidas = express.Router();
  const rotas_abertas = express.Router();

  server.use('/', rotas_abertas);
  rotas_abertas.get('/', index_controller.index);
};
