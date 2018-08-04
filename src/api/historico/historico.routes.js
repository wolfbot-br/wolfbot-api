const express = require('express');
const auth = require('../../config/auth');

module.exports = function (server) {

    const historicoController = require('../historico/historico.controller');

    const protectedRoutes = express.Router();
    const openRoutes = express.Router();

    protectedRoutes.use(auth);

    server.use('/api', protectedRoutes);

    openRoutes.post('/historicos', historicoController.historicos);
};
