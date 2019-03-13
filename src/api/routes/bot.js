const express = require("express");
const auth = require("../middlewares/auth");
const controller = require("../controllers/bot");

module.exports = function(server) {
    const protectedRoutes = express.Router();

    // protectedRoutes.use(auth)
    server.use("/bot", protectedRoutes);

    protectedRoutes.post("/acionarRobo", controller.acionarRobo);
}
