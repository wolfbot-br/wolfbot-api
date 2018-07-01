const express = require('express');
const auth = require('../../config/auth');

module.exports = function (server) {
  const indexController = require('../index/index.controller');

  const protectedRoutes = express.Router();
  const openRoutes = express.Router();

  server.use('/', openRoutes);

  openRoutes.get('/', indexController.index);
};
