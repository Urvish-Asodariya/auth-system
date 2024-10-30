const express=require("express");
const router=express.Router();
const usercontrol=require("../controller/user.control");

router.post("/register",usercontrol.register);
router.post("/login",usercontrol.login);
router.patch("/changepass",usercontrol.changepassword);

module.exports=router;