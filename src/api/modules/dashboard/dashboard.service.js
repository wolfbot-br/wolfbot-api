const moment = require("moment");
const Order = require("../../models/orderModel");

const dayResult = () => {
    return "resultado do dia!";
};

const overallResult = () => {
    return "resultado geral!";
};

const totalizerOpenOrdersAndClosedOrders = () => {
    return "quantidade de ordens abertas e fechadas!";
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
