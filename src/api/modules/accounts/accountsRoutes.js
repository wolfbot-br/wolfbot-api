const express = require("express");
const auth = require("../../middlewares/authentication");
const controller = require("../accounts/accountsController");

module.exports = function(server) {
    const protectedRoutes = express.Router();
    const openRoutes = express.Router();

    protectedRoutes.use(auth);

    server.use("/api", protectedRoutes);
    server.use("/account", openRoutes);

    openRoutes.post("/signup", controller.signup);
    openRoutes.get("/active", controller.activeAccount);

    openRoutes.post("/passwordRecovery", controller.passwordRecovery);
    openRoutes.post("/changepasswordpermition", controller.changePasswordPermition);
    openRoutes.post("/changepassword", controller.changePassword);
    openRoutes.post("/createtoken", controller.createToken);
    openRoutes.get("/getuserbyemail", controller.getUserByEmail);
    openRoutes.post("/login", controller.login);
    openRoutes.get("/me", controller.me);
};
