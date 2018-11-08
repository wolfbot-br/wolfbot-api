const express = require('express')
const auth = require('../../config/auth')

module.exports = function (server) {
    const orderController = require('../order/order.controller')

    const protectedRoutes = express.Router()

    // protectedRoutes.use(auth)
    server.use('/api/order', protectedRoutes)

    protectedRoutes.get('/open', orderController.open)
    protectedRoutes.get('/close', orderController.close)
    protectedRoutes.post('/buy', orderController.buy)
    protectedRoutes.post('/sell', orderController.sell)
    protectedRoutes.post('/cancel', orderController.cancel)
}
