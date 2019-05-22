const moment = require("moment");
const Order = require("../orders/orderService");

const dayResult = async (uid) => {
    try {
        const closeResult = await Order.getOrdersCloseByUserMongo(uid);
        let total = 0;
        const closeOrders = closeResult.filter((item) => {
            const resultday = moment(item.date).isSame(Date.now(), "day");
            console.log(resultday)
            if (item.type_operation === "sell" && resultday) {
                return item;
            }
            return 0;
        });
        console.log(closeOrders);
        return total;
    } catch (error) {
        return error;
    }
};

const overallResult = async (uid) => {
    try {
        const closeResult = await Order.getOrdersCloseByUserMongo(uid);
        let total = 0;
        closeResult.filter((item) => {
            if (item.type_operation === "sell") {
                total += item.cost;
            }
            return 0;
        });
        return total;
    } catch (error) {
        return error;
    }
};

const totalizerOpenOrdersAndClosedOrders = async (uid) => {
    try {
        const openOrders = await Order.getOrdersOpenByUserMongo(uid);
        const closeResult = await Order.getOrdersCloseByUserMongo(uid);
        const closeOrders = closeResult.filter((item) => {
            if (item.type_operation === "sell") {
                return item;
            }
            return 0;
        });
        return {
            openOrders: openOrders.length,
            closeOrders: closeOrders.length,
        };
    } catch (error) {
        return error;
    }
};

const operationsSummary = () => {
    return "resumo de operações!";
};

const openOrdersTable = () => {
    return "tabela com ordens abertas!";
};

module.exports = {
    dayResult,
    overallResult,
    totalizerOpenOrdersAndClosedOrders,
    operationsSummary,
    openOrdersTable,
};
