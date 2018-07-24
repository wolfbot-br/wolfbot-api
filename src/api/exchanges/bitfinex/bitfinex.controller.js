const ccxt = require('ccxt');
const exchangeToken = require('../../../infraestrutura/mongo/models/exchangesTokens.model');
const bitfinexValidation = require('../bitfinex/bitfinex.validation');

// # PUBLIC METHODS /

const structure = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    res.status(200).json({ data: bitfinex });
}

const currencies = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    let currencies = await bitfinex.fetchCurrencies();
    res.status(200).json({ data: currencies });
}

const loadMarkets = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    let markets = await bitfinex.loadMarkets(true);
    res.status(200).json({ data: markets });
}

// Retorna todos aos tipos de cryptomoedas que a exchange trabalha
const symbols = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    let markets = await bitfinex.loadMarkets(true);
    let symbols = bitfinex.symbols;
    res.status(200).json({ data: symbols });
}

const getMarketStructureBySimbol = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';
    let markets = await bitfinex.loadMarkets(true);

    symbol = `${Base}/${Quote}`;

    let marketsStructure = bitfinex.market(symbol);

    res.status(200).json({ data: marketsStructure });
}

const getMarketIdBySimbol = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';
    let markets = await bitfinex.loadMarkets(true);

    marketSymbol = `${Base}/${Quote}`;

    let marketsId = bitfinex.marketId(marketSymbol);

    res.status(200).json({ data: marketsId });
}

const fetchOrderBookBySymbol = async (req, res, next) => {
    let bitfinex = new ccxt.bitfinex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';

    marketSymbol = `${Base}/${Quote}`;

    let orderBook = await bitfinex.fetchOrderBook(marketSymbol);

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

// # PRIVATE METHODS /

// Retorna o saldo da conta da bitfinex
const fetchBalance = async (req, res, next) => {

    try {

        let bitfinex = new ccxt.bitfinex();

        params = {
            id_usuario: req.query.id_usuario,
            id_exchange: req.query.id_exchange
        }

        bitfinexValidation.validarDados(params);

        //Um dos melhores jeitos de fazer um select
        const credenciais = await exchangeToken
            .findOne({ "usuario.id_usuario": params.id_usuario })
            .where({ "exchange.id_exchange": params.id_exchange });

        bitfinexValidation.validarRequisitosExchange(credenciais);

        bitfinex.apiKey = credenciais.api_key;
        bitfinex.secret = credenciais.secret;

        let saldo = await bitfinex.fetchBalance();
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