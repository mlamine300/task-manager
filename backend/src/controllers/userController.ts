import { Request, Response } from "express";
import userModel from "../models/User.ts";
import taskModel from "../models/Task.ts";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel
      .find({ role: { $ne: "admin" } })
      .lean()
      .exec();
    if (!users) return res.json({ message: "there is no users" });
    const usersWithTask = await Promise.all(
      users.map(async (user) => {
        const pendingTask = await taskModel.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });

        const inProgressTask = await taskModel.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });

        const completedTask = await taskModel.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });
        return { ...user, pendingTask, inProgressTask, completedTask };
      })
    );
    //console.log(usersWithTask);
    return res.status(200).json(usersWithTask);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(409).json({ message: "id is required!!" });
    const user = await userModel.findById(id).lean().exec();
    if (!user) return res.status(404).json({ message: "user not found!!!" });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    res.status(200).json("hola from users");
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};
