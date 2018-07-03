const ccxt = require('ccxt');

// # PUBLIC METHODS /

const structure = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    res.status(200).json({ Bittrex: bittrex });
}
const currencies = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    let currencies = await bittrex.fetchCurrencies();
    res.status(200).json({ currencies: currencies });
}
const loadMarkets = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    let markets = await bittrex.loadMarkets(true);
    res.status(200).json({ bittrex: markets });
}
const symbols = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    let markets = await bittrex.loadMarkets(true);
    let symbols = bittrex.symbols;
    res.status(200).json({ symbols: symbols });
}
const getMarketStructureBySimbol = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';
    let markets = await bittrex.loadMarkets(true);

    symbol = `${Base}/${Quote}`;

    let marketsStructure = bittrex.market(symbol);

    res.status(200).json({ market: marketsStructure });
}
const getMarketIdBySimbol = async (req, res, next) => {

    let bittrex = new ccxt.bittrex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';
    let markets = await bittrex.loadMarkets(true);

    marketSymbol = `${Base}/${Quote}`;

    let marketsId = bittrex.marketId(marketSymbol);

    res.status(200).json({ Id: marketsId });
}
const fetchOrderBookBySymbol = async (req, res, next) => {
    let bittrex = new ccxt.bittrex();
    let Base = req.headers.base || '';
    let Quote = req.headers.quote || '';

    marketSymbol = `${Base}/${Quote}`;

    let orderBook = await bittrex.fetchOrderBook(marketSymbol);

    res.status(200).json({ orderBook: orderBook });
}

module.exports = {
    loadMarkets,
    getMarketStructureBySimbol,
    getMarketIdBySimbol,
    symbols,
    currencies,
    structure,
    fetchOrderBookBySymbol
};