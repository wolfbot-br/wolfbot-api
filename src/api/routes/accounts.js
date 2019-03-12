import Router from "koa-joi-router";

import accounts from "../controllers/accounts";

const router = Router();

router.prefix("/account");

router.route([
    {
        method: "POST",
        path: "/createtoken",
        handler: [accounts.createToken],
    },
    {
        method: "GET",
        path: "/getuserbyemail",
        handler: [accounts.getUserByEmail],
    },
    {
        method: "POST",
        path: "/login",
        handler: [accounts.login],
    },
    {
        method: "POST",
        path: "/signup",
        handler: [accounts.signup],
    },
    {
        method: "GET",
        path: "/me",
        handler: [accounts.me],
    },
    {
        method: "GET",
        path: "/active",
        handler: [accounts.activeAccount],
    },
]);

export default router;
