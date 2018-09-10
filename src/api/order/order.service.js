const ccxt = require('ccxt')
const configuracao = require('../../infraestrutura/mongo/models/configuracao.model')
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
            'status': 200
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
            'status': 200
        })

    } catch (e) {
        res.status(400).json({
            'message': e.message,
            'status': '400'
        })
    }
}
module.exports = { orderAberta, orderFechada }