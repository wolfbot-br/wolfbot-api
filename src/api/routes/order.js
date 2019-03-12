import Router from "koa-joi-router";

import order from "../controllers/order";

const router = Router();

router.prefix("/order");

router.route([
    {
        method: "GET",
        path: "/open",
        handler: [order.open],
    },
    {
        method: "CLOSE",
        path: "/close",
        handler: [order.close],
    },
    {
        method: "POST",
        path: "/buy",
        handler: [order.buy],
    },
    {
        method: "sell",
        path: "/sell",
        handler: [order.sell],
    },
    {
        method: "cancel",
        path: "/cancel",
        handler: [order.cancel],
    },
]);

export default router;
