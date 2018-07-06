
const ccxt = require('ccxt');

// # PUBLIC METHODS /

const structure = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    res.status(200).json({ bitfinex: bitfinex });
}

const currencies = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    let currencies = await bitfinex.fetchCurrencies();
    res.status(200).json({ currencies: currencies });
}

const loadMarkets = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    let markets = await bitfinex.loadMarkets(true);
    res.status(200).json({ bitfinex: markets });
}

const symbols = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    let markets = await bitfinex.loadMarkets(true);
    let symbols = bitfinex.symbols;
    res.status(200).json({ symbols: symbols });
}

const getMarketStructureBySimbol = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';
    let markets = await bitfinex.loadMarkets(true);

    symbol = `${Base}/${Quote}`;

    let marketsStructure = bitfinex.market(symbol);

    res.status(200).json({ market: marketsStructure });
}

const getMarketIdBySimbol = async (req, res, next) => {

    let bitfinex = new ccxt.bitfinex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';
    let markets = await bitfinex.loadMarkets(true);

    marketSymbol = `${Base}/${Quote}`;

    let marketsId = bitfinex.marketId(marketSymbol);

    res.status(200).json({ Id: marketsId });
}

const fetchOrderBookBySymbol = async (req, res, next) => {
    let bitfinex = new ccxt.bitfinex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';

    marketSymbol = `${Base}/${Quote}`;

    let orderBook = await bitfinex.fetchOrderBook(marketSymbol);

    res.status(200).json({ orderBook: orderBook });
}

// BUSCA TODOS OS TICKER
const fetchTickers = async (req, res, next) => {
    let bitfinex = new ccxt.bitfinex();
    let tickers = await bitfinex.fetchTickers();
    res.status(200).json({ tick: tickers });
}

// BUSCA UM TICKER ESPECÍFICO
const fetchTicker = async (req, res, next) => {
    let bitfinex = new ccxt.bitfinex();
    var symbol = req.query.symbol;
    let ticker = await bitfinex.fetchTicker(symbol);
    res.status(200).json({ tick: ticker });
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
    fetchTicker
};