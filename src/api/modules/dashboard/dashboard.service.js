const moment = require("moment");
const Order = require("../orders/orderService");

const dayResult = async (uid) => {
    try {
        const time = moment;
        time.locale("pt-br");
        const today = time().format("YYYY-MM-DD");
        let total = 0;
        const closeOrders = await Order.getOrdersSellCloseByUserManual(uid);
        closeOrders.filter((item) => {
            if (time(item.date).isSame(today, "day")) {
                total += item.cost;
            }
            return 0;
        });
        return total;
    } catch (error) {
        return error;
    }
};

const overallResult = async (uid) => {
    try {
        const closeOrders = await Order.getOrdersSellCloseByUserManual(uid);
        let total = 0;
        closeOrders.map((item) => {
            total += item.cost;
            return 0;
        });
        return total;
    } catch (error) {
        return error;
    }
};

const totalizerOpenOrdersAndClosedOrders = async (uid) => {
    try {
        const openOrders = await Order.getOrdersOpenByUserManual(uid);
        const closeOrders = await Order.getOrdersSellCloseByUserManual(uid);
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
