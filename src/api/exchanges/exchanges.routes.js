const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
  const exchangeController = require('../exchanges/exchanges.controller')

  const protectedRoutes = express.Router()

  // protectedRoutes.use(auth)
  server.use('/api/exchanges', protectedRoutes)

  // PUBLIC METHODS
  protectedRoutes.get('/loadExchanges', exchangeController.loadExchanges)
  protectedRoutes.get('/structure', exchangeController.structure)
  protectedRoutes.get('/symbols', exchangeController.symbols)
  protectedRoutes.get('/currencies', exchangeController.currencies)
  protectedRoutes.get('/loadmarkets', exchangeController.loadMarkets)
  protectedRoutes.get('/getMarketStructureBySimbol', exchangeController.getMarketStructureBySimbol)
  protectedRoutes.get('/getMarketIdBySimbol', exchangeController.getMarketIdBySimbol)
  protectedRoutes.get('/fetchOrderBookBySymbol', exchangeController.fetchOrderBookBySymbol)
  protectedRoutes.get('/ticker', exchangeController.fetchTicker)
  protectedRoutes.get('/tickers', exchangeController.fetchTickers)

  // PRIVATE METHODS
  protectedRoutes.get('/saldo', exchangeController.fetchBalance)
  protectedRoutes.post('/buy', exchangeController.orderBuy)
  protectedRoutes.post('/sell', exchangeController.orderSell)
  protectedRoutes.get('/openOrdens', exchangeController.openOrders)
}
