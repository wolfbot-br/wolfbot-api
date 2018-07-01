const express = require('express');
const auth = require('../../config/auth');

module.exports = function (server) {
    const utilController = require('../util/util.controller');

    const protectedRoutes = express.Router();
    const openRoutes = express.Router();

    protectedRoutes.use(auth);

    server.use('/api', protectedRoutes);

    server.use('/util', openRoutes);

    openRoutes.get('/exchanges/all', utilController.listAllExchanges);

};
