import Router from "koa-joi-router";

import util from "../controllers/util";

const router = Router();

router.prefix("/util");

router.route([
    {
        method: "GET",
        path: "/exchanges/all",
        handler: [util.listAllExchanges],
    },
]);

export default router;
