const express = require("express");
const auth = require("../../middlewares/authentication");
const controller = require("./botController");

module.exports = function(server) {
    const protectedRoutes = express.Router();

    // protectedRoutes.use(auth)
    server.use("/bot", protectedRoutes);

    protectedRoutes.post("/acionarRobo", controller.acionarRobo);
};
