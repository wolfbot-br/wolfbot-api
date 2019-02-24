import express from "express";
import controller from "../controllers/index";

export default (server) => {
    const openRoutes = express.Router();
    server.use("/api", openRoutes);
    openRoutes.get("/index", controller.index);
};
