import express from "express";
import { registerUser, loginUser, verify, getUserByUid, getUserGroup, joinGroup, createGroup, saveAvatar, fetchAvatar } from "../controllers/users.controller.js";

const router = express.Router();

// user routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/verify", verify);
router.post("/getInfo", getUserByUid);

// groups
router.post("/getUserGroup", getUserGroup);
router.post("/joinGroup", joinGroup);
router.post("/createGroup", createGroup);
router.post("/saveAvatar", saveAvatar);
router.post("/fetchAvatar", fetchAvatar)

export default router;