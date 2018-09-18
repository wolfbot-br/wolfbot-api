const ccxt = require('ccxt')
const configuracao = require('../../infraestrutura/mongo/models/configuracao.model')
const order = require('../../infraestrutura/mongo/models/order.model')
const moment = require('moment')

const orderAberta = async (params, res) => {

    try {
        const config = await configuracao.findOne({ 'user.user_id': params.user_id })
        const parMoedas = `${config.target_currency}/${config.base_currency}`

        let nome_exchange = config.exchange.toLowerCase()

        exchangeCCXT = new ccxt[nome_exchange]()
        exchangeCCXT.apiKey = config.api_key
        exchangeCCXT.secret = config.secret

        if (params.time)
            var time = new Date(params.time).getTime();
        else
            time = ''

        ordens = await exchangeCCXT.fetchOpenOrders(
            symbol = parMoedas,
            since = time,
            limit = params.limit,
            params = {}
        )

        res.status(200).json({
            'data': ordens,
            'status': '200'
        })

    } catch (e) {
        res.status(400).json({
            'message': e.message,
            'status': '400'
        })
    }
}

const orderFechada = async (params, res) => {

    try {
        const config = await configuracao.findOne({ 'user.user_id': params.user_id })
        const parMoedas = `${config.target_currency}/${config.base_currency}`

        let nome_exchange = config.exchange.toLowerCase()

        exchangeCCXT = new ccxt[nome_exchange]()
        exchangeCCXT.apiKey = config.api_key
        exchangeCCXT.secret = config.secret

        const tempo = moment().subtract(365, 'days')

        ordens = await exchangeCCXT.fetchClosedOrders(
            symbol = parMoedas,
            since = tempo.valueOf(),
            limit = 1,
            params = {}
        )

        res.status(200).json({
            'data': ordens,
            'status': '200'
        })

    } catch (e) {
        res.status(400).json({
            'message': e.message,
            'status': '400'
        })
    }
}

const comprar = async (params, res) => {

    try {
        const config = await configuracao.findOne({ 'user.user_id': params.user_id })
        const parMoedas = `${config.target_currency}/${config.base_currency}`

        let nome_exchange = config.exchange.toLowerCase()

        exchangeCCXT = new ccxt[nome_exchange]()
        exchangeCCXT.apiKey = config.api_key
        exchangeCCXT.secret = config.secret

        order_buy = await exchangeCCXT.createLimitBuyOrder(
            params.symbol, // Simbolo da cryptomoeda BTC/USDT
            params.amount, // Montante
            params.price, // Preço de venda
            { ' type ': params.type } // tipo: limite ou mercado
        )

        let orders = new order({
            date: order_buy.datetime,
            amount: order_buy.amount,
            price: order_buy.price,
            currency: order_buy.symbol,
            type_order: params.type,
            type_operation: params.type_operation,
            action: order_buy.side,
            user: config.user.user_name,
            identifier: order_buy.id
        })

        orders.save(function (err) {
            if (err) {
                throw new Error('Erro!' + err.message);
            }
        })

        if (params.type_operation != "Automatic") {
            res.status(200).json({
                'data': ordens,
                'message': "Order de compra criada com sucesso.",
                'status': '200'
            })
        }

    } catch (e) {
        if (params.type_operation != "Automatic") {
            res.status(400).json({
                'message': e.message,
                'status': '400'
            })
        }
    }
}

const vender = async (params, res) => {

    try {
        const config = await configuracao.findOne({ 'user.user_id': params.user_id })

        let nome_exchange = config.exchange.toLowerCase()

        exchangeCCXT = new ccxt[nome_exchange]()
        exchangeCCXT.apiKey = config.api_key
        exchangeCCXT.secret = config.secret

        let order_sell = await exchangeCCXT.createLimitSellOrder(
            params.symbol, // Simbolo da cryptomoeda BTC/USDT
            params.amount, // Montante
            params.price, // Preço de venda
            { ' type ': params.type } // tipo: limite ou mercado
        )

        let orders = new order({
            date: order_sell.datetime,
            amount: order_sell.amount,
            price: order_sell.price,
            currency: order_sell.symbol,
            type_order: params.type,
            type_operation: params.type_operation,
            action: order_sell.side,
            user: config.user.user_name,
            identifier: order_sell.id
        })

        orders.save(function (err) {
            if (err) {
                throw new Error('Erro!' + err.message);
            }
        })

        if (params.type_operation != "Automatic") {
            res.status(200).json({
                'data': order_sell,
                'message': "Order de venda criada com sucesso.",
                'status': '200'
            })
        }

    } catch (e) {
        if (params.type_operation != "Automatic") {
            res.status(400).json({
                'message': e.message,
                'status': '400'
            })
        }
    }
}

const cancelar = async (params, res) => {

    try {
        const config = await configuracao.findOne({ 'user.user_id': params.user_id })
        let nome_exchange = config.exchange.toLowerCase()

        const orders = await order.findOne({ 'identifier': params.identifier });

        exchangeCCXT = new ccxt[nome_exchange]()
        exchangeCCXT.apiKey = config.api_key
        exchangeCCXT.secret = config.secret

        exchangeCCXT.cancelOrder(orders.identifier)

        res.status(200).json({
            'message': "Order cancelada com sucesso.",
            'status': '200'
        })

    } catch (e) {
        res.status(400).json({
            'message': e.message,
            'status': '400'
        })
    }
}

module.exports = { orderAberta, orderFechada, comprar, vender, cancelar }