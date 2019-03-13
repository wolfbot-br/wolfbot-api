const express = require("express");
const auth = require("../middlewares/auth");
const controller = require("../controllers/historico");

module.exports = function(server) {
    const protectedRoutes = express.Router();

    protectedRoutes.use(auth);
    server.use("/api", protectedRoutes);

    protectedRoutes.get("/historicos", controller.historicos);
}
