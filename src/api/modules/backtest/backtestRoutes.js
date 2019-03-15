const express = require("express");
const auth = require("../../middlewares/authentication");
const controller = require("./backtestController");

module.exports = function(server) {
    const protectedRoutes = express.Router();

    protectedRoutes.use(auth);
    server.use("/api", protectedRoutes);

    protectedRoutes.post("/backtest/testarConfiguracao", controller.testarConfiguracao);
};
