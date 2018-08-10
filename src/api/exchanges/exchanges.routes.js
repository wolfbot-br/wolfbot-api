const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
  const exchangeController = require('../exchanges/exchanges.controller')

  const protectedRoutes = express.Router()
  const openRoutes = express.Router()

  protectedRoutes.use(auth)

  server.use('/api', protectedRoutes)
  server.use('/exchanges', openRoutes)

  // PUBLIC METHODS
  openRoutes.get('/structure', exchangeController.structure)
  openRoutes.get('/symbols', exchangeController.symbols)
  openRoutes.get('/currencies', exchangeController.currencies)
  openRoutes.get('/loadmarkets', exchangeController.loadMarkets)
  openRoutes.get('/getMarketStructureBySimbol', exchangeController.getMarketStructureBySimbol)
  openRoutes.get('/getMarketIdBySimbol', exchangeController.getMarketIdBySimbol)
  openRoutes.get('/fetchOrderBookBySymbol', exchangeController.fetchOrderBookBySymbol)
  openRoutes.get('/ticker', exchangeController.fetchTicker)
  openRoutes.get('/tickers', exchangeController.fetchTickers)

  // PRIVATE METHODS
  openRoutes.get('/saldo', exchangeController.fetchBalance)
  openRoutes.post('/buy', exchangeController.orderBuy)
  openRoutes.post('/sell', exchangeController.orderSell)
  openRoutes.get('/openOrdens', exchangeController.openOrders)
}
