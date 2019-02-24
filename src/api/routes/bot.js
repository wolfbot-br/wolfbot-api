import Router from "koa-joi-router";

import bot from "../controllers/bot";

const router = Router();

router.prefix("/bot");

router.route({
    method: "POST",
    path: "/acionarRobo",
    handler: [bot.acionarRobo],
});

export default router;
