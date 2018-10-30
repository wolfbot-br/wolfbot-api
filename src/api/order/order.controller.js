const validation = require('../order/order.validation')
const service = require('../order/order.service')

const open = (req, res, next) => {

    try {
        params = {
            user_id: req.query.user_id,
        }
        service.getOrdersOpenByUser(params, res)
    } catch (e) {
        res.status(400).json({
            'message': e.message,
            'status': '400'
        })
    }
}

const close = (req, res, next) => {

    try {
        params = {
            user_id: req.query.user_id,
            time: req.query.time,
            limit: req.query.limite
        }

        validation.dados(params)
        service.orderFechada(params, res)
    } catch (e) {
        res.status(400).json({
            'message': e.message,
            'status': '400'
        })
    }
}

const buy = (req, res, next) => {

    try {
        params = {
            user_id: req.body.user_id,
            symbol: req.body.symbol,
            amount: req.body.amount,
            price: req.body.price,
            type_operation: req.body.type_operation,
            symbol: req.body.symbol,
            type: req.body.type,
            action: req.body.action
        }

        validation.dados(params)
        service.comprar(params, res)
    } catch (e) {
        res.status(400).json({
            'message': e.message,
            'status': '400'
        })
    }
}

const sell = (req, res, next) => {

    try {
        params = {
            user_id: req.body.user_id,
            symbol: req.body.symbol,
            amount: req.body.amount,
            price: req.body.price,
            type_operation: req.body.type_operation,
            symbol: req.body.symbol,
            type: req.body.type,
            action: req.body.action
        }

        validation.dados(params)
        service.vender(params, res)
    } catch (e) {
        res.status(400).json({
            'message': e.message,
            'status': '400'
        })
    }
}

const cancel = (req, res, next) => {

    try {
        params = {
            user_id: req.body.user_id,
            identifier: req.body.identifier,
        }

        service.cancelar(params, res)
    } catch (e) {
        res.status(400).json({
            'message': e.message,
            'status': '400'
        })
    }
}

module.exports = {
    open,
    close,
    buy,
    sell,
    cancel
}