const express = require("express");
const router = express.Router();
const usercontrol = require("../controller/user.control");
const { auth } = require("../middleware/auth");

router.post("/register", usercontrol.register);
router.post("/login", usercontrol.login);
router.patch("/changepass",auth, usercontrol.changepassword);

module.exports = router;