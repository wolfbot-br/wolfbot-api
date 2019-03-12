import ccxt from "ccxt";
import Configuracao from "../database/mongo/models/configuracao.model";
import validator from "../validators/exchanges.validation";
import service from "../services/util";

// # PUBLIC METHODS /

// Método que retorna todas as exchanges que bot trabalha
const loadExchanges = (ctx) => {
    const { exchanges } = ccxt;
    const dataExchanges = exchanges.map(function(e) {
        return { value: e, label: e };
    });

    return ctx.ok({
        data: dataExchanges,
        status: "200",
    });
};

const structure = async (ctx) => {
    const params = {
        exchange: ctx.request.params.exchange,
    };

    const exchange = service.selecionarExchange(params.exchange);
    return ctx.ok({
        data: exchange,
    });
};
// / CONTINUAR DAQUI
const currencies = async (req, res, next) => {
    try {
        params = {
            exchange: req.query.exchange,
        };

        const exchange = service.selecionarExchange(params.exchange);
        const currencies = await exchange.fetchCurrencies();
        res.status(200).json({
            data: currencies,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

const loadMarkets = async (req, res, next) => {
    try {
        params = {
            exchange: req.query.exchange,
        };

        const exchange = service.selecionarExchange(params.exchange);
        const markets = await exchange.loadMarkets(true);
        res.status(200).json({
            data: markets,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

// Retorna todos aos tipos de cryptomoedas que a exchange trabalha
const symbols = async (req, res, next) => {
    try {
        params = {
            exchange: req.query.exchange,
        };

        const exchange = service.selecionarExchange(params.exchange);
        const markets = await exchange.loadMarkets(true);
        const { symbols } = exchange;

        res.status(200).json({
            data: symbols,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

const getMarketStructureBySimbol = async (req, res, next) => {
    try {
        params = {
            exchange: req.query.exchange,
        };

        const exchange = service.selecionarExchange(params.exchange);
        const Base = req.headers.base || "";
        const Quote = req.headers.quote || "";
        const markets = await exchange.loadMarkets(true);

        symbol = `${Base}/${Quote}`;

        const marketsStructure = exchange.market(symbol);

        res.status(200).json({
            data: marketsStructure,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

const getMarketIdBySimbol = async (req, res, next) => {
    try {
        params = {
            exchange: req.query.exchange,
        };

        const exchange = service.selecionarExchange(params.exchange);
        const Base = req.headers.base || "";
        const Quote = req.headers.quote || "";
        const markets = await exchange.loadMarkets(true);

        marketSymbol = `${Base}/${Quote}`;

        const marketsId = exchange.marketId(marketSymbol);

        res.status(200).json({
            data: marketsId,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

const fetchOrderBookBySymbol = async (req, res, next) => {
    try {
        params = {
            exchange: req.query.exchange,
        };

        const exchange = service.selecionarExchange(params.exchange);
        const Base = req.headers.base || "";
        const Quote = req.headers.quote || "";

        marketSymbol = `${Base}/${Quote}`;

        const orderBook = await exchange.fetchOrderBook(marketSymbol);

        res.status(200).json({
            data: orderBook,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

// Busca todos os tickes
const fetchTickers = async (req, res, next) => {
    try {
        params = {
            exchange: req.query.exchange,
        };

        const exchange = service.selecionarExchange(params.exchange);
        const tickers = await exchange.fetchTickers();
        res.status(200).json({
            data: tickers,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

// Busca um ticker específico
const fetchTicker = async (req, res, next) => {
    try {
        params = {
            exchange: req.query.exchange,
            symbol: req.query.symbol,
        };

        if (!params.symbol) {
            res.status(400).json({
                msg: "Simbolo incorreto",
                status: "500",
            });
        }

        const exchange = service.selecionarExchange(params.exchange);
        const ticker = await exchange.fetchTicker(params.symbol);

        res.status(200).json({
            data: ticker,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

// # PRIVATE METHODS /

const fetchBalance = async (req, res, next) => {
    try {
        params = {
            id_usuario: req.query.id_usuario,
            exchange: req.query.exchange, // LEMBRETE...HACK PARA FUNCIONAR VIDEO DO DIA 21/08
        };

        if (params.id_usuario) {
            const config = await Configuracao.findOne({ "user.user_id": params.id_usuario });
            const nome_exchange = config.exchange.toLowerCase();
            const exchangeCCXT = new ccxt[nome_exchange]();
            exchangeCCXT.apiKey = config.api_key;
            exchangeCCXT.secret = config.secret;

            const saldo = await exchangeCCXT.fetchBalance();
            res.status(200).json({
                data: saldo,
            });
        }
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

const orderBuy = async (req, res, next) => {
    try {
        if (!req.body.simbolo) {
            throw new Error("Informe o simbolo");
        }

        params = {
            id_usuario: req.body.id_usuario,
            id_exchange: req.body.id_exchange,
            tipo: req.body.tipo,
            simbolo: req.body.simbolo.toUpperCase(),
            montante: req.body.montante,
            preco: req.body.preco,
            exchange: req.body.exchange,
        };

        const exchange = service.selecionarExchange(params.exchange);
        validator.validarDados(params);

        // Um dos melhores jeitos de fazer um select
        const credenciais = await Configuracao.findOne({
            "usuario.id_usuario": params.id_usuario,
        }).where({
            "exchange.id_exchange": params.id_exchange,
        });

        validator.validarRequisitosExchange(credenciais);

        exchange.apiKey = credenciais.api_key;
        exchange.secret = credenciais.secret;

        order = await exchange.createLimitBuyOrder(
            params.simbolo, // Simbolo da cryptomoeda BTC/USDT
            params.montante, // Montante
            params.preco, // Preço de venda
            { " tipo ": params.tipo } // tipo: limite ou mercado
        );

        res.status(200).json({
            data: order,
            message: "Ordem de compra realizada com sucesso.",
            status: 200,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

const orderSell = async (req, res, next) => {
    try {
        if (!req.body.simbolo) {
            throw new Error("Informe o simbolo");
        }

        params = {
            id_usuario: req.body.id_usuario,
            id_exchange: req.body.id_exchange,
            tipo: req.body.tipo,
            simbolo: req.body.simbolo.toUpperCase(),
            montante: req.body.montante,
            preco: req.body.preco,
            exchange: req.body.exchange,
        };

        const exchange = service.selecionarExchange(params.exchange);
        validator.validarDados(params);

        // Um dos melhores jeitos de fazer um select
        const credenciais = await Configuracao.findOne({
            "usuario.id_usuario": params.id_usuario,
        }).where({
            "exchange.id_exchange": params.id_exchange,
        });

        validator.validarRequisitosExchange(credenciais);

        exchange.apiKey = credenciais.api_key;
        exchange.secret = credenciais.secret;

        order = await exchange.createLimitSellOrder(
            params.simbolo, // Simbolo da cryptomoeda BTC/USDT
            params.montante, // Montante
            params.preco, // Preço de venda
            { " tipo ": params.tipo } // tipo: limite ou mercado
        );

        res.status(200).json({
            data: order,
            message: "Ordem de venda realizada com sucesso..",
            status: 200,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

const openOrders = async (req, res, next) => {
    try {
        if (!req.query.simbolo) {
            throw new Error("Informe o simbolo");
        }

        params = {
            id_usuario: req.query.id_usuario,
            id_exchange: req.query.id_exchange,
            simbolo: req.query.simbolo.toUpperCase(),
            tempo: req.query.tempo,
            limite: req.query.limite,
            exchange: req.query.exchange,
        };

        const exchange = service.selecionarExchange(params.exchange);
        validator.validarDados(params);

        // Um dos melhores jeitos de fazer um select
        const credenciais = await Configuracao.findOne({
            "usuario.id_usuario": params.id_usuario,
        }).where({
            "exchange.id_exchange": params.id_exchange,
        });

        validator.validarRequisitosExchange(credenciais);

        exchange.apiKey = credenciais.api_key;
        exchange.secret = credenciais.secret;

        ordens = await exchange.fetchOpenOrders(
            (symbol = params.simbolo),
            (since = params.tempo),
            (limit = params.limite),
            (params = {})
        );

        res.status(200).json({
            data: ordens,
            status: 200,
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

export default {
    loadExchanges,
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
    openOrders,
};
