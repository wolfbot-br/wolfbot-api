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
    let bitfinex = new ccxt.bitfinex();
    let tickers = await bitfinex.fetchTickers();
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

    let bitfinex = new ccxt.bitfinex();
    let ticker = await bitfinex.fetchTicker(symbol);
    res.status(200).json({ data: ticker });
}

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
            .find({ "usuario.id_usuario": params.id_usuario })
            .where({ "exchange.id_exchange": params.id_exchange });

        console.log(credenciais);

        totalCredencial = Object.keys(credenciais).length;
        bittrexValidation.validarRequisitosExchange(totalCredencial);

        for (i = 0; i < totalCredencial; i++) {
            bittrex.apiKey = credenciais[i].api_key;
            bittrex.secret = credenciais[i].secret;
        }

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
    fetchBalance
};