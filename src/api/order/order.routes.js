const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
    const orderController = require('../order/order.controller')

    const protectedRoutes = express.Router()
    const openRoutes = express.Router()

    // protectedRoutes.use(auth)

    server.use('/order', openRoutes)

    openRoutes.get('/open', orderController.open)
    openRoutes.get('/close', orderController.close)
    openRoutes.post('/buy', orderController.buy)
    openRoutes.post('/sell', orderController.sell)
    // openRoutes.post('/cancel', orderController.cancel)
}
