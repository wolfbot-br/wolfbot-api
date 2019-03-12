import Router from "koa-joi-router";

import historico from "../controllers/historico";

const router = Router();

router.prefix("/historicos");

router.route([
    {
        method: "GET",
        path: "/",
        handler: [historico.historicos],
    },
]);

export default router;
