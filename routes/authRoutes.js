const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.get("/login", AuthController.login);
router.post("/login", AuthController.loginPost);
router.post("/register", AuthController.registerPost);
router.get("/register", AuthController.register);
router.get("/logout", AuthController.logout);

module.exports = router;
