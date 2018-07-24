const express = require('express');
const auth = require('../../../config/auth');

module.exports = function (server) {
    const bitfinexController = require('../bitfinex/bitfinex.controller');

    const protectedRoutes = express.Router();
    const openRoutes = express.Router();

    protectedRoutes.use(auth);

    server.use('/api', protectedRoutes);
    server.use('/bitfinex', openRoutes);

    // PUBLIC METHODS
    openRoutes.get('/structure', bitfinexController.structure);
    openRoutes.get('/symbols', bitfinexController.symbols);
    openRoutes.get('/currencies', bitfinexController.currencies);
    openRoutes.get('/loadmarkets', bitfinexController.loadMarkets);
    openRoutes.get('/getMarketStructureBySimbol', bitfinexController.getMarketStructureBySimbol);
    openRoutes.get('/getMarketIdBySimbol', bitfinexController.getMarketIdBySimbol);
    openRoutes.get('/fetchOrderBookBySymbol', bitfinexController.fetchOrderBookBySymbol);
    openRoutes.get('/ticker', bitfinexController.fetchTicker);
    openRoutes.get('/tickers', bitfinexController.fetchTickers);

    // PRIVATE METHODS
    openRoutes.get('/saldo', bitfinexController.fetchBalance);
    openRoutes.post('/buy', bitfinexController.orderBuy);
    openRoutes.post('/sell', bitfinexController.orderSell);
};
