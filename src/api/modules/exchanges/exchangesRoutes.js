const express = require("express");
const auth = require("../../middlewares/authentication");
const controller = require("./exchangesController");

module.exports = function(server) {
    const protectedRoutes = express.Router();

    // protectedRoutes.use(auth)
    server.use("/api/exchanges", protectedRoutes);

    // PUBLIC METHODS
    protectedRoutes.get("/loadExchanges", controller.loadExchanges);
    protectedRoutes.get("/structure", controller.structure);
    protectedRoutes.get("/symbols", controller.symbols);
    protectedRoutes.get("/currencies", controller.currencies);
    protectedRoutes.get("/loadmarkets", controller.loadMarkets);
    protectedRoutes.get("/getMarketStructureBySimbol", controller.getMarketStructureBySimbol);
    protectedRoutes.get("/getMarketIdBySimbol", controller.getMarketIdBySimbol);
    protectedRoutes.get("/fetchOrderBookBySymbol", controller.fetchOrderBookBySymbol);
    protectedRoutes.get("/ticker", controller.fetchTicker);
    protectedRoutes.get("/tickers", controller.fetchTickers);

    // PRIVATE METHODS
    protectedRoutes.get("/saldo", controller.fetchBalance);
    protectedRoutes.post("/buy", controller.orderBuy);
    protectedRoutes.post("/sell", controller.orderSell);
    protectedRoutes.get("/openOrdens", controller.openOrders);
};
