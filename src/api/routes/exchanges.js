import Router from "koa-joi-router";

import exchanges from "../controllers/exchanges";

const router = Router();

router.prefix("/exchanges");

router.route([
    {
        method: "GET",
        path: "/loadExchanges",
        handler: [exchanges.loadExchanges],
    },
    {
        method: "GET",
        path: "/structure",
        handler: [exchanges.structure],
    },
    {
        method: "GET",
        path: "/symbols",
        handler: [exchanges.symbols],
    },
    {
        method: "GET",
        path: "/currencies",
        handler: [exchanges.currencies],
    },
    {
        method: "GET",
        path: "/loadmarkets",
        handler: [exchanges.loadMarkets],
    },
    {
        method: "GET",
        path: "/getMarketStructureBySimbol",
        handler: [exchanges.getMarketStructureBySimbol],
    },
    {
        method: "GET",
        path: "/getMarketIdBySimbol",
        handler: [exchanges.getMarketIdBySimbol],
    },
    {
        method: "GET",
        path: "/fetchOrderBookBySymbol",
        handler: [exchanges.fetchOrderBookBySymbol],
    },
    {
        method: "GET",
        path: "/ticker",
        handler: [exchanges.fetchTicker],
    },
    {
        method: "GET",
        path: "/tickers",
        handler: [exchanges.fetchTickers],
    },
    {
        method: "GET",
        path: "/saldo",
        handler: [exchanges.fetchBalance],
    },
    {
        method: "POST",
        path: "/buy",
        handler: [exchanges.orderBuy],
    },
    {
        method: "POST",
        path: "/sell",
        handler: [exchanges.orderSell],
    },
    {
        method: "POST",
        path: "/buy",
        handler: [exchanges.orderBuy],
    },
    {
        method: "GET",
        path: "/openOrdens",
        handler: [exchanges.openOrders],
    },
]);

export default router;
