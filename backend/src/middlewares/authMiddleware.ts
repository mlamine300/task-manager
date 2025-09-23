import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { type NextFunction, type Request, type Response } from "express";
import userModel from "../models/User.js";
import type { tokenPayload } from "../types/index.ts";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "you don't have permission" });
  }
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
    return res.status(401).json({ message: "you don't have permission" });
  }
  const { userId } = decoded as tokenPayload;
  const user = await userModel.findById(userId).select("-password").exec();
  if (!user)
    return res.status(401).json({ message: "you don't have permission" });
  else next();
  //    const token = req.headers.Authorization.replace('Bearer ', '');
  //     const {userId}=jwt.decode(token.)
};

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "you don't have permission" });
  }
  const { role } = jwt.decode(token) as tokenPayload;

  if (!role || role !== "admin") {
    return res.status(401).json({ message: "you don't have asmin permission" });
  }
  next();
};
