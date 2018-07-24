const ccxt = require('ccxt');
const exchangeToken = require('../../../infraestrutura/mongo/models/exchangesTokens.model');
const bittrexValidation = require('../bittrex/bittrex.validation');

// # PUBLIC METHODS /

const structure = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    res.status(200).json({ data: bittrex });
}

const currencies = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    let currencies = await bittrex.fetchCurrencies();
    res.status(200).json({ data: currencies });
}

const loadMarkets = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    let markets = await bittrex.loadMarkets(true);
    res.status(200).json({ data: markets });
}

// Retorna todos aos tipos de cryptomoedas que a exchange trabalha
const symbols = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    let markets = await bittrex.loadMarkets(true);
    let symbols = bittrex.symbols;
    res.status(200).json({ data: symbols });
}

const getMarketStructureBySimbol = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';
    let markets = await bittrex.loadMarkets(true);

    symbol = `${Base}/${Quote}`;

    let marketsStructure = bittrex.market(symbol);

    res.status(200).json({ data: marketsStructure });
}

const getMarketIdBySimbol = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';
    let markets = await bittrex.loadMarkets(true);

    marketSymbol = `${Base}/${Quote}`;

    let marketsId = bittrex.marketId(marketSymbol);

    res.status(200).json({ data: marketsId });
}

const fetchOrderBookBySymbol = async (req, res, next) => {
    let bittrex = new ccxt.bittrex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';

    marketSymbol = `${Base}/${Quote}`;

    let orderBook = await bittrex.fetchOrderBook(marketSymbol);

    res.status(200).json({ data: orderBook });
}

// Busca todos os tickes
const fetchTickers = async (req, res, next) => {
    let bittrex = new ccxt.bittrex();
    let tickers = await bittrex.fetchTickers();
    res.status(200).json({ data: tickers });
}

// Busca um ticker específico
const fetchTicker = async (req, res, next) => {

    var symbol = req.query.symbol;

    if (!symbol) {
        res.status(500).json({
            msg: "Simbolo incorreto",
            status: "500"
        });
    }

    let bittrex = new ccxt.bittrex();
    let ticker = await bittrex.fetchTicker(symbol);
    res.status(200).json({ data: ticker });
}

// # PRIVATE METHODS /

const fetchBalance = async (req, res, next) => {

    try {

        let bittrex = new ccxt.bittrex();

        params = {
            id_usuario: req.query.id_usuario,
            id_exchange: req.query.id_exchange
        }

        bittrexValidation.validarDados(params);

        //Um dos melhores jeitos de fazer um select
        const credenciais = await exchangeToken
            .findOne({ "usuario.id_usuario": params.id_usuario })
            .where({ "exchange.id_exchange": params.id_exchange });

        bittrexValidation.validarRequisitosExchange(credenciais);

        bittrex.apiKey = credenciais.api_key;
        bittrex.secret = credenciais.secret;

        let saldo = await bittrex.fetchBalance();
        res.status(200).json({
            data: saldo
        });

    } catch (e) {
        res.status(400).json({
            "message": e.message,
            "status": "400"
        });
    }
}

const orderBuy = async (req, res, next) => {

    try {
        let bittrex = new ccxt.bittrex();

        if (!req.body.simbolo) {
            throw new Error("Informe o simbolo")
        }

        params = {
            id_usuario: req.query.id_usuario,
            id_exchange: req.query.id_exchange,
            tipo: req.body.tipo,
            simbolo: req.body.simbolo.toUpperCase(),
            montante: req.body.montante,
            preco: req.body.preco
        }

        bittrexValidation.validarDados(params);

        //Um dos melhores jeitos de fazer um select
        const credenciais = await exchangeToken
            .findOne({ "usuario.id_usuario": params.id_usuario })
            .where({ "exchange.id_exchange": params.id_exchange });

        bittrexValidation.validarRequisitosExchange(credenciais);

        bittrex.apiKey = credenciais.api_key;
        bittrex.secret = credenciais.secret;

        order = await bittrex.createLimitBuyOrder(
            params.simbolo, // Simbolo da cryptomoeda BTC/USDT
            params.montante, // Montante
            params.preco, // Preço de venda
            { ' tipo ': params.tipo } // tipo: limite ou mercado
        )

        res.status(200).json({
            "data": order,
            "message": "Método em manutenção",
            "status": 200
        });

    } catch (e) {
        res.status(400).json({
            "message": e.message,
            "status": "400"
        });
    }
}

const orderSell = async (req, res, next) => {

    try {

        let bittrex = new ccxt.bittrex();

        if (!req.body.simbolo) {
            throw new Error("Informe o simbolo")
        }

        params = {
            id_usuario: req.body.id_usuario,
            id_exchange: req.body.id_exchange,
            tipo: req.body.tipo,
            simbolo: req.body.simbolo.toUpperCase(),
            montante: req.body.montante,
            preco: req.body.preco
        }

        bittrexValidation.validarDados(params);

        //Um dos melhores jeitos de fazer um select
        const credenciais = await exchangeToken
            .findOne({ "usuario.id_usuario": params.id_usuario })
            .where({ "exchange.id_exchange": params.id_exchange });

        bittrexValidation.validarRequisitosExchange(credenciais);

        bittrex.apiKey = credenciais.api_key;
        bittrex.secret = credenciais.secret;

        order = await bittrex.createLimitSellOrder(
            params.simbolo, // Simbolo da cryptomoeda BTC/USDT
            params.montante, // Montante
            params.preco, // Preço de venda
            { ' tipo ': params.tipo } // tipo: limite ou mercado
        )

        res.status(200).json({
            "data": order,
            "message": "Ordem de compra realizada com sucesso.",
            "status": 200
        });

    } catch (e) {
        res.status(400).json({
            "message": e.message,
            "status": "400"
        });
    }
}

const openOrders = async (req, res, next) => {

    try {

        let bittrex = new ccxt.bittrex();

        if (!req.query.simbolo) {
            throw new Error("Informe o simbolo")
        }

        params = {
            id_usuario: req.query.id_usuario,
            id_exchange: req.query.id_exchange,
            simbolo: req.query.simbolo.toUpperCase(),
            tempo: req.query.tempo,
            limite: req.query.limite
        }

        bittrexValidation.validarDados(params);

        //Um dos melhores jeitos de fazer um select
        const credenciais = await exchangeToken
            .findOne({ "usuario.id_usuario": params.id_usuario })
            .where({ "exchange.id_exchange": params.id_exchange });

        bittrexValidation.validarRequisitosExchange(credenciais);

        bittrex.apiKey = credenciais.api_key;
        bittrex.secret = credenciais.secret;

        ordens = await bittrex.fetchOpenOrders(
            symbol = params.simbolo,
            since = params.tempo,
            limit = params.limite,
            params = {}
        )

        res.status(200).json({
            "data": ordens,
            "status": 200
        });
    } catch (e) {
        res.status(400).json({
            "message": e.message,
            "status": "400"
        });
    }
}

module.exports = {
    loadMarkets,
    getMarketStructureBySimbol,
    getMarketIdBySimbol,
    symbols,
    currencies,
    structure,
    fetchOrderBookBySymbol,
    fetchTickers,
    fetchTicker,
    fetchBalance,
    orderBuy,
    orderSell,
    openOrders
};