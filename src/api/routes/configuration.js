const express = require("express");
const auth = require("../middlewares/auth");
const controller = require("../controllers/configuration");

module.exports = function(server) {
    const protectedRoutes = express.Router();

    // protectedRoutes.use(auth)
    server.use("/api/configuracao", protectedRoutes);

    protectedRoutes.get("/carregar", controller.get);
    protectedRoutes.post("/salvar", controller.post);
    protectedRoutes.put("/alterar", controller.put);
    protectedRoutes.delete("/deletar", controller.exclusao);
}
