const express = require('express');
const auth = require('../../config/auth');

module.exports = function (server) {
    const exchangeController = require('../exchange/exchange.controller');

    const protectedRoutes = express.Router();
    const openRoutes = express.Router();

    protectedRoutes.use(auth);

    server.use('/api', protectedRoutes);
    server.use('/exchange', openRoutes);

    openRoutes.get('/', exchangeController.index);
    openRoutes.post('/', exchangeController.post);
    openRoutes.put('/', exchangeController.put);
    openRoutes.delete('/', exchangeController.exclusao);
};