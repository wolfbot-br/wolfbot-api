const moment = require("moment");
const Order = require("../orders/orderService");

const dayResult = () => {
    return "resultado do dia!";
};

const overallResult = () => {
    return "resultado geral!";
};

const totalizerOpenOrdersAndClosedOrders = async (uid) => {
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
