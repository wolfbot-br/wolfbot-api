import Router from "koa-joi-router";

import configuracao from "../controllers/configuration";

const router = Router();

router.prefix("/configuracao");

router.route([
    {
        method: "GET",
        path: "/carregar",
        handler: [configuracao.get],
    },
    {
        method: "POST",
        path: "/salvar",
        handler: [configuracao.post],
    },
    {
        method: "PUT",
        path: "/alterar",
        handler: [configuracao.put],
    },
    {
        method: "DELETE",
        path: "/alterar",
        handler: [configuracao.exclusao],
    },
]);

export default router;
