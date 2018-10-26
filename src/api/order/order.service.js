const ccxt = require('ccxt')
const configuracao = require('../../infraestrutura/mongo/models/configuracao.model')
const order = require('../../infraestrutura/mongo/models/order.model')
const moment = require('moment')
const _ = require('lodash')

const ordersOpen = async (params, res) => {

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

const ordersClose = async (params, res) => {

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

const orderBuy = async (config, params, res) => {
    try {
        let nome_exchange = config.exchange.toLowerCase()
        exchangeCCXT = new ccxt[nome_exchange]()
        exchangeCCXT.apiKey = config.api_key
        exchangeCCXT.secret = config.secret
        await exchangeCCXT.loadMarkets()
        pair_currency = `${params.target_currency}/${config.base_currency}`
        const bids = await exchangeCCXT.fetchOrderBook(pair_currency)
        const price = _.first(bids.asks)
        const amount = config.purchase_quantity / price[0]
        //consulto se tenho saldo da moeda base que utilizarei para comprar outra moeda
        const total_balance = await exchangeCCXT.fetchBalance()
        const balance = total_balance[config.base_currency]
        const purchase_value = Number.parseFloat(price) * Number.parseFloat(amount)
        let order_buy = {}


        const trades = await exchangeCCXT.fetchClosedOrders()
        console.log(trades)



        // if (purchase_value <= balance.free) {
        //     order_buy = await exchangeCCXT.createLimitBuyOrder(
        //         pair_currency, // Simbolo da cryptomoeda BTC/USDT
        //         Number.parseFloat(amount.toFixed(8)), // Montante
        //         Number.parseFloat(price) // Preço da moeda que será comprada
        //     )
        // }

        // let orders = new order({
        //     date: moment(),
        //     amount: amount.toFixed(8),
        //     price: price[0],
        //     cost: 
        //     currency: params.target_currency,
        //     type_operation: order_buy.side,
        //     action: params.action,
        //     user: config.user.user_id,
        //     identifier: order_buy.id,
        //     status: 'open'
        // })

        // orders.save(function (err) {
        //     if (err) {
        //         throw new Error('Erro!' + err.message);
        //     }
        // })

        if (params.action != "Automatic") {
            res.status(200).json({
                'data': ordens,
                'message': "Order de compra criada com sucesso.",
                'status': '200'
            })
        }

    } catch (e) {
        if (params.action != "Automatic") {
            res.status(400).json({
                'message': e.message,
                'status': '400'
            })
        }
    }
}

const orderSell = async (params, res) => {

    try {
        const config = await configuracao.findOne({ 'user.user_id': params.user_id })

        let nome_exchange = config.exchange.toLowerCase()

        exchangeCCXT = new ccxt[nome_exchange]()
        exchangeCCXT.apiKey = config.api_key
        exchangeCCXT.secret = config.secret

        let order_sell = await exchangeCCXT.createLimitSellOrder(
            params.symbol, // Simbolo da cryptomoeda BTC/USDT
            params.amount, // Montante
            params.price, // Preço da moeda para ser vendida
        )

        let orders = new order({
            date: order_sell.datetime,
            amount: order_sell.amount,
            price: order_sell.price,
            currency: order_sell.symbol,
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

const orderCancel = async (params, res) => {

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

async function checkBalance() {

}



module.exports = { ordersOpen, ordersClose, orderBuy, orderSell, orderCancel }