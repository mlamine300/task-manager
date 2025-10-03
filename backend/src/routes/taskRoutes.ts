import express from "express";
import { checkAdmin, protect } from "../middlewares/authMiddleware.ts";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getDashboardData,
  getTaskById,
  getUserDashboardData,
  updateTask,
  updateTaskChecklist,
  updateTaskStatus,
} from "../controllers/taskController.ts";
const taskRouter = express.Router();

taskRouter.get("/dashboard-data", protect, checkAdmin, getDashboardData);
taskRouter.get("/user-dashboard-data", protect, getUserDashboardData);
taskRouter.get("/", protect, getAllTasks);
taskRouter.get("/:id", protect, getTaskById);
taskRouter.post("/", protect, checkAdmin, createTask);
taskRouter.put("/:id", protect, updateTask);
taskRouter.delete("/:id", protect, checkAdmin, deleteTask);
taskRouter.put("/:id/status", protect, updateTaskStatus);
taskRouter.put("/:id/todo", protect, updateTaskChecklist);

export default taskRouter;
