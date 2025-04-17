import express from "express";
import { getAllTasks, addTask, updateTask, deleteTask } from "../controllers/tasks.controller.js";

const router = express.Router();

// task routes
router.get("/getAllTasks", getAllTasks);
router.post("/addTask", addTask);
router.patch("/updateTask/:taskId", updateTask);
router.delete("/deleteTask/:taskId", deleteTask);



export default router;