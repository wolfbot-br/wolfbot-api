import Router from "koa-joi-router";

import backtest from "../controllers/backtest";

const router = Router();

router.prefix("/backtest");

router.route({
    method: "POST",
    path: "/testarConfiguracao",
    handler: [backtest.testarConfiguracao],
});

export default router;
