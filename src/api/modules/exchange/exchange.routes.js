const express = require("express");
const controller = require("./exchange.controller");

module.exports = (server) => {
    const protectedRoutes = express.Router();
    server.use("/api/exchanges", protectedRoutes);

    // PRIVATE METHODS
    protectedRoutes.get("/saldo", controller.fetchBalance);
};
