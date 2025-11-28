//Dependecies and Modules
const express = require("express");
const userController = require("../controllers/users.js");
const { verify } = require("../auth.js");

//Routing Component
const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getUserDetails);

module.exports = router;
