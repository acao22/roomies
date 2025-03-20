import express from "express";
import { registerUser, loginUser, verify, getUserByUid, getUserGroup } from "../controllers/users.controller.js";

const router = express.Router();

// user routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/verify", verify);
router.post("/getInfo", getUserByUid);
router.post("/getUserGroup", getUserGroup);

export default router;