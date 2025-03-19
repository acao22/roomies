import express from "express";
import { registerUser, loginUser, verify } from "../controllers/users.controller.js";

const router = express.Router();

// user routes
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/verify", verify);

export default router;