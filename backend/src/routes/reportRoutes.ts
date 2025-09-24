import express from "express";

import {
  generateTaskReport,
  generateUserReport,
} from "../controllers/reportController.ts";
import { checkAdmin, protect } from "../middlewares/authMiddleware.ts";
const reportRouter = express.Router();

reportRouter.get("/export/tasks", protect, checkAdmin, generateTaskReport);
reportRouter.get("/export/users", protect, checkAdmin, generateUserReport);

export default reportRouter;
