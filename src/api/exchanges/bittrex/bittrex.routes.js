const express = require('express');
const auth = require('../../../config/auth');

module.exports = function (server) {
    const bittrexController = require('../bittrex/bittrex.controller');

    const protectedRoutes = express.Router();
    const openRoutes = express.Router();

    protectedRoutes.use(auth);

    server.use('/api', protectedRoutes);
    server.use('/bittrex', openRoutes);

    // PUBLIC METHODS
    openRoutes.get('/structure', bittrexController.structure);
    openRoutes.get('/symbols', bittrexController.symbols);
    openRoutes.get('/currencies', bittrexController.currencies);
    openRoutes.get('/loadmarkets', bittrexController.loadMarkets);
    openRoutes.get('/getMarketStructureBySimbol', bittrexController.getMarketStructureBySimbol);
    openRoutes.get('/getMarketIdBySimbol', bittrexController.getMarketIdBySimbol);
    openRoutes.get('/fetchOrderBookBySymbol', bittrexController.fetchOrderBookBySymbol);
    openRoutes.get('/ticker', bittrexController.fetchTicker);
    openRoutes.get('/tickers', bittrexController.fetchTickers);

    // PRIVATE METHODS
    openRoutes.get('/saldo', bittrexController.fetchBalance);
    openRoutes.post('/buy', bittrexController.orderBuy);
    openRoutes.post('/sell', bittrexController.orderSell);

};