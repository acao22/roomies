import express from "express";
import { getAllTasks, addTask, updateTask } from "../controllers/tasks.controller.js";

const router = express.Router();

// task routes
router.get("/getAllTasks", getAllTasks);
router.post("/addTask", addTask);
router.patch("/updateTask/:taskId", updateTask)

export default router;