const express = require("express");
const auth = require("../../middlewares/authentication");
const controller = require("./historicController");

module.exports = function(server) {
    const protectedRoutes = express.Router();

    protectedRoutes.use(auth);
    server.use("/api", protectedRoutes);

    protectedRoutes.get("/historicos", controller.historicos);
};
