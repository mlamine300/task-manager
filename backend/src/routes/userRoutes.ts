import express from "express";
import { checkAdmin, protect } from "../middlewares/authMiddleware.ts";
import {
  deleteUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController.ts";
const userRouter = express.Router();

userRouter.get("/", protect, checkAdmin, getAllUsers);
userRouter.get("/:id", protect, checkAdmin, getUserById);
userRouter.delete("/:id", protect, checkAdmin, deleteUser);

export default userRouter;
