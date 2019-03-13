const express = require("express");
const controller = require("../controllers/backtest");

module.exports = function(server) {
    const protectedRoutes = express.Router();

    // protectedRoutes.use(auth);
    server.use("/api", protectedRoutes);

    protectedRoutes.post("/backtest/testarConfiguracao", controller.testarConfiguracao);
}
