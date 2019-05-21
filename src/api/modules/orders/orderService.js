const ccxt = require("ccxt");
const moment = require("moment");
const _ = require("lodash");
const configuracao = require("../../models/configurationModel");
const order = require("../../models/orderModel");

const getOrdersOpenByCurrency = async (params, res) => {
    try {
        const orders = await order.find({
            user: params.user_id,
            currency: params.currency,
            status: "open",
        });

        if (params.action !== "Automatic") {
            res.status(200).json({
                data: orders,
                status: "200",
            });
        } else {
            return orders;
        }
    } catch (e) {
        if (params.action !== "Automatic") {
            res.status(400).json({
                message: e.message,
                status: "400",
            });
        }
    }
};

const getOrdersOpenByUser = async (params, res) => {
    try {
        const orders = await order.find({
            user: params.user_id,
            status: "open",
        });

        if (params.action !== "Automatic") {
            res.status(200).json({
                data: orders,
                status: "200",
            });
        } else {
            return orders;
        }
    } catch (e) {
        if (params.action !== "Automatic") {
            res.status(400).json({
                message: e.message,
                status: "400",
            });
        }
    }
};

const getOrdersOpenByUserMongo = async (uid) => {
    try {
        const orders = await order.find({
            user: uid,
            status: "open",
        });
        return orders;
    } catch (error) {
        return error;
    }
};

const getOrdersCloseByUserMongo = async (uid) => {
    try {
        const orders = await order.find({
            user: uid,
            status: "close",
        });
        return orders;
    } catch (error) {
        return error;
    }
};

const getOrdersClose = async (params, res) => {
    try {
        const config = await configuracao.findOne({ "user.user_id": params.user_id });
        const parMoedas = `${config.target_currency}/${config.base_currency}`;

        let nome_exchange = config.exchange.toLowerCase();

        exchangeCCXT = new ccxt[nome_exchange]();
        exchangeCCXT.apiKey = config.api_key;
        exchangeCCXT.secret = config.secret;

        const tempo = moment().subtract(365, "days");

        ordens = await exchangeCCXT.fetchClosedOrders(
            (symbol = parMoedas),
            (since = tempo.valueOf()),
            (limit = 1),
            (params = {})
        );

        res.status(200).json({
            data: ordens,
            status: "200",
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

const orderBuy = async function (config, params, res) {
    try {
        const time = moment;
        time.locale("pt-br");
        let nome_exchange = config.exchange.toLowerCase();
        exchangeCCXT = new ccxt[nome_exchange]();
        exchangeCCXT.apiKey = config.api_key;
        exchangeCCXT.secret = config.secret;
        pair_currency = `${params.target_currency}/${config.base_currency}`;
        const bids = await exchangeCCXT.fetchOrderBook(pair_currency); //busco orderbook de preços
        const price = _.first(bids.asks); //pego o melhor preço de compra
        const amount = config.purchase_quantity / price[0]; //acho a quantidade que vou comprar
        const total_balance = await exchangeCCXT.fetchBalance(); // vejo se tenho saldo na moeda base
        const balance = total_balance[config.base_currency]; // filtro saldo da moeda base
        const purchase_value = config.purchase_quantity + (Number.parseFloat(price) * 0.25) / 100;
        let order_buy = {};

        if (purchase_value <= balance.free) {
            /* order_buy = await exchangeCCXT.createLimitBuyOrder(
                pair_currency, // Simbolo do par de moedas a ser comprado
                Number.parseFloat(amount.toFixed(8)), // Montante a ser comprado
                Number.parseFloat(price[0]) // Preço da moeda que será comprada
            ); */
            const orders = new order({
                date: time().format(),
                amount: amount.toFixed(8),
                price: price[0],
                cost: config.purchase_quantity,
                currency: params.target_currency,
                type_operation: "buy",
                action: params.action,
                user: config.user.user_id,
                identifier: Date.now().toString, //order_buy.id,
                status: "open",
            });

            orders.save(function (err) {
                if (err) {
                    throw new Error("Erro!" + err.message);
                }
            });
        }

        if (params.action !== "Automatic") {
            res.status(200).json({
                data: ordens,
                message: "Order de compra criada com sucesso.",
                status: "200",
            });
        } else {
            return order_buy;
        }
    } catch (e) {
        if (params.action !== "Automatic") {
            res.status(400).json({
                message: e.message,
                status: "400",
            });
        } else {
            return e;
        }
    }
};

const orderSell = async function (config, params, order_buy, res) {
    try {
        const time = moment;
        time.locale("pt-br");
        let nome_exchange = config.exchange.toLowerCase();
        exchangeCCXT = new ccxt[nome_exchange]();
        exchangeCCXT.apiKey = config.api_key;
        exchangeCCXT.secret = config.secret;
        pair_currency = `${params.target_currency}/${config.base_currency}`;
        const bids = await exchangeCCXT.fetchOrderBook(pair_currency); //busco orderbook de preços
        const price = _.first(bids.bids); //pego o melhor preço de venda
        const amount = Number.parseFloat(order_buy.amount); //acho a quantidade que vou vender
        const total_balance = await exchangeCCXT.fetchBalance(); // vejo se tenho saldo na moeda alvo
        const balance = total_balance[params.target_currency]; // filtro saldo da moeda alvo
        let order_sell = {};

        if (amount <= balance.free) {
            /* order_sell = await exchangeCCXT.createLimitSellOrder(
                pair_currency, // Simbolo do par de moedas a ser vendido
                amount, // Montante a ser vendido
                Number.parseFloat(price[0]) // Preço da moeda que será vendida
            ); */
            const orders = new order({
                date: time().format(),
                amount: amount,
                price: price[0],
                cost: Number.parseFloat(price[0]) * amount,
                currency: params.target_currency,
                type_operation: "sell",
                action: params.action,
                user: config.user.user_id,
                identifier: Date.now().toString,//order_sell.id,
                status: "close",
            });

            orders.save(function (err) {
                if (err) {
                    throw new Error("Erro!" + err.message);
                }
            });
        }

        if (params.action !== "Automatic") {
            res.status(200).json({
                data: order_sell,
                message: "Order de venda criada com sucesso.",
                status: "200",
            });
        }
    } catch (e) {
        if (params.action !== "Automatic") {
            res.status(400).json({
                message: e.message,
                status: "400",
            });
        }
    }
};

const orderCancel = async function (params, res) {
    try {
        const config = configuracao.findOne({ "user.user_id": params.user_id });
        let nome_exchange = config.exchange.toLowerCase();

        const orders = order.findOne({ identifier: params.identifier });

        exchangeCCXT = new ccxt[nome_exchange]();
        exchangeCCXT.apiKey = config.api_key;
        exchangeCCXT.secret = config.secret;

        await exchangeCCXT.cancelOrder(orders.identifier);

        res.status(200).json({
            message: "Order cancelada com sucesso.",
            status: "200",
        });
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

const orderUpdateStatus = function (params, order_buy, res) {
    try {
        order.update({ _id: order_buy._id }, { status: "close" }, (error) => {
            if (error) {
                return error;
            }
        });

        if (params.action != "Automatic") {
            res.status(200).json({
                data: order_sell,
                message: "Order de venda criada com sucesso.",
                status: "200",
            });
        }
    } catch (e) {
        if (params.action != "Automatic") {
            res.status(400).json({
                message: e.message,
                status: "400",
            });
        }
    }
};

module.exports = {
    getOrdersOpenByCurrency,
    getOrdersClose,
    orderBuy,
    orderSell,
    orderCancel,
    orderUpdateStatus,
    getOrdersOpenByUser,
    getOrdersOpenByUserMongo,
    getOrdersCloseByUserMongo,
};
