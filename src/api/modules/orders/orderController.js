const validation = require("./orderValidation");
const service = require("./orderService");
const Order = require("../../models/orderModel");

const open = (req, res, next) => {
    try {
        params = {
            user_id: req.query.user_id,
        };
        service.getOrdersOpenByUser(params, res);
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

const close = (req, res, next) => {
    try {
        params = {
            user_id: req.query.user_id,
            time: req.query.time,
            limit: req.query.limite,
        };

        validation.dados(params);
        service.orderFechada(params, res);
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

const buy = async (req, res) => {
    try {
        const { uid } = req.user;
        const order = {
            date: Date.now(),
            amount: req.body.amount,
            price: req.body.price,
            cost: req.body.cost,
            currency: req.body.currency,
            type_operation: "buy",
            action: req.body.action,
            user: uid,
            identifier: Date.now().toString(), // order_buy.id,
            status: "open",
        };

        const orderResult = await Order.create(order);
        res.status(200).json({
            orderResult,
        });
    } catch (e) {
        res.status(400).json({
            message: e,
        });
    }
};

const sell = async (req, res) => {
    try {
        const { uid } = req.user;
        const order = {
            date: Date.now(),
            amount: req.body.amount,
            price: req.body.price,
            cost: req.body.cost,
            currency: req.body.currency,
            type_operation: "sell",
            action: req.body.action,
            user: uid,
            identifier: Date.now().toString(), // order_buy.id,
            status: "close",
        };

        const orderResult = await Order.create(order);
        res.status(200).json({
            orderResult,
        });
    } catch (e) {
        res.status(400).json({
            message: e,
        });
    }
};

const cancel = (req, res, next) => {
    try {
        params = {
            user_id: req.body.user_id,
            identifier: req.body.identifier,
        };

        service.cancelar(params, res);
    } catch (e) {
        res.status(400).json({
            message: e.message,
            status: "400",
        });
    }
};

module.exports = {
    open,
    close,
    buy,
    sell,
    cancel,
};
