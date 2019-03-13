const express = require("express");
const controller = require("../controllers/index");

module.exports = (server) => {
    const openRoutes = express.Router();
    server.use("/api", openRoutes);
    openRoutes.get("/index", controller.index);
};
