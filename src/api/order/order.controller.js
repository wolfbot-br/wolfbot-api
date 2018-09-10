const validation = require('../order/order.validation')
const service = require('../order/order.service')

const open = (req, res, next) => {

    try {
        params = {
            user_id: req.query.user_id,
            time: req.query.time,
            limit: req.query.limite
        }

        let validarDados = validation.dados(params)
        let orderAberta = service.orderAberta(params, res)
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

        let validarDados = validation.dados(params)
        let orderAberta = service.orderFechada(params, res)
    } catch (e) {
        res.status(400).json({
            'message': e.message,
            'status': '400'
        })
    }
}

const buy = (req, res, next) => {

}

const sell = (req, res, next) => {

}

module.exports = {
    open,
    close,
    buy,
    sell
}