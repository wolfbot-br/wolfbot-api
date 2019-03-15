const express = require("express");
const auth = require("../../middlewares/authentication");
const controller = require("./utilsController");

module.exports = function(server) {
    const protectedRoutes = express.Router();
    const openRoutes = express.Router();

    protectedRoutes.use(auth);

    server.use("/api", protectedRoutes);

    server.use("/util", openRoutes);

    openRoutes.get("/exchanges/all", controller.listAllExchanges);
};
