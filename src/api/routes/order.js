import express from "express";
import controller from "../controllers/order";

export default function(server) {
    const protectedRoutes = express.Router();

    // protectedRoutes.use(auth)
    server.use("/api/order", protectedRoutes);

    protectedRoutes.get("/open", controller.open);
    protectedRoutes.get("/close", controller.close);
    protectedRoutes.post("/buy", controller.buy);
    protectedRoutes.post("/sell", controller.sell);
    protectedRoutes.post("/cancel", controller.cancel);
}
