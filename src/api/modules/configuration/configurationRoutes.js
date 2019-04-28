const express = require("express");
const controller = require("./configurationController");

module.exports = (server) => {
    const protectedRoutes = express.Router();
    server.use("/api/configuracao", protectedRoutes);

    protectedRoutes.get("/buscar", controller.get);
    protectedRoutes.post("/salvar", controller.post);
    protectedRoutes.put("/alterar", controller.put);
    protectedRoutes.delete("/deletar", controller.exclusao);
};
