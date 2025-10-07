import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/index.ts";
import userModel from "../models/User.ts";
import taskModel, { isTodo, TodoType } from "../models/Task.ts";
import { json } from "stream/consumers";
import mongoose from "mongoose";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const totalTasks = await taskModel.countDocuments();
    const pendingTasks = await taskModel.countDocuments({ status: "Pending" });
    const completedTasks = await taskModel.countDocuments({
      status: "Completed",
    });
    const overdueTasks = await taskModel.countDocuments({
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });
    const taskStatues = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await taskModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskDistribution = taskStatues.reduce((acc: any, curr: string) => {
      const key = curr.replace(/\s+/g, "");
      const founItem = taskDistributionRaw.find((item) => item._id === curr);
      ////console.log(founItem + " - " + founItem?.count);
      acc[key] = founItem?.count ?? 0;
      return acc;
    }, {});
    taskDistribution["all"] = totalTasks;

    const taskPriority = ["Low", "Medium", "High"];
    const taskPriorityLevelRaw = await taskModel.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevel = taskPriority.reduce((acc: any, curr: string) => {
      const key = curr.replace(/\s+/g, "");
      const findItem = taskPriorityLevelRaw.find((item) => item._id === curr);
      acc[key] = findItem?.count ?? 0;
      return acc;
    }, {});
    taskPriorityLevel["all"] = totalTasks;
    const recentTasks = await taskModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevel,
      },
      recentTasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error, ", error });
  }
};
export const getUserDashboardData = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ message: "not autorized" });
    const { userId } = (await jwt.decode(token)) as TokenPayload;
    if (!userId) return res.status(409).json({ message: "not autorized" });

    const totalTasks = await taskModel.countDocuments({ assignedTo: userId });

    const pendingTasks = await taskModel.countDocuments({
      status: "Pending",
      assignedTo: new mongoose.Types.ObjectId(userId),
    });

    const completedTasks = await taskModel.countDocuments({
      status: "Completed",
      assignedTo: new mongoose.Types.ObjectId(userId),
    });

    const overdueTasks = await taskModel.countDocuments({
      assignedTo: new mongoose.Types.ObjectId(userId),
      status: { $ne: "Completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatues = ["Pending", "In Progress", "Completed"];
    const taskDistributionRaw = await taskModel.aggregate([
      { $match: { assignedTo: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskDistribution = taskStatues.reduce((acc: any, curr: string) => {
      const key = curr.replace(/\s+/g, "");
      const founItem = taskDistributionRaw.find((item) => item._id === curr);

      acc[key] = founItem?.count ?? 0;
      return acc;
    }, {});
    taskDistribution["all"] = totalTasks;

    const taskPriority = ["Low", "Medium", "High"];
    const taskPriorityLevelRaw = await taskModel.aggregate([
      { $match: { assignedTo: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPriorityLevel = taskPriority.reduce((acc: any, curr: string) => {
      const key = curr.replace(/\s+/g, "");
      const findItem = taskPriorityLevelRaw.find((item) => item._id === curr);
      acc[key] = findItem?.count ?? 0;
      return acc;
    }, {});
    taskPriorityLevel["all"] = totalTasks;
    const recentTasks = await taskModel
      .find({ assignedTo: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");
    res.status(200).json({
      statistics: {
        totalTasks,
        pendingTasks,
        completedTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevel,
      },
      recentTasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error, ", error });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ message: "not authorized" });
    const { role, userId } = jwt.decode(token) as TokenPayload;
    if (!role) return res.status(409).json({ message: "not authorized" });
    if (role === "admin") {
      const tasks = await taskModel
        .find()
        .populate("assignedTo", "name email profileImageUrl");
      // .lean()
      // .exec();
      return res.json(tasks);
    }
    const tasks = await taskModel
      .find({ assignedTo: userId })
      .populate("assignedTo", "name email profileImageUrl");
    //   .lean()
    //   .exec();
    return res.json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error, ", error });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "id is required!" });
    }
    const task = await taskModel
      .findById(id)
      .populate("assignedTo", "name email profileImageUrl")
      .lean()
      .exec();
    if (!task) return res.status(404).json({ message: "task not found!!!" });

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: "server error, ", error });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      todoChecklist,
      progress,
      attachments,
    } = req.body;
    if (!title || !todoChecklist || !todoChecklist.length) {
      return res.status(409).json({ message: "feilds is required!!!" });
    }
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ message: "not authorized" });
    const { userId } = (await jwt.decode(token)) as TokenPayload;
    const task = await taskModel.create({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      todoChecklist,
      progress,
      attachments,
      createdBy: userId,
    });
    if (!task) return res.status(500).json({ message: "server error, " });
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "server error, ", error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).json({ message: "task id is required!" });
    const task = await taskModel.findById(id);
    if (!task) return res.status(404).json({ message: "task not found" });
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ message: "not athorized!!" });

    const { userId, role } = (await jwt.decode(token)) as TokenPayload;

    if (!userId) return res.status(409).json({ message: "not athorized!!" });
    if (!task?.assignedTo.find((t) => t.equals(userId)) && role !== "admin") {
      return res.status(409).json({
        message: "not athorized!!",
        // role,
        // userId,
        // assignedTo: task?.assignedTo,
      });
    }

    const title = req.body?.title || task.title;
    const description = req.body?.description || task.description;
    const status = req.body?.status || task.status;
    const todoChecklist = req.body?.todoChecklist || task.todoChecklist;
    // const progress = req.body?.todoChecklist
    //   ? req.body?.todoChecklist.reduce(
    //       (prev: number, current: { text: string; completed: boolean }) => {
    //         if (current.completed) {
    //           prev += 100 / req.body?.todoChecklist.length;
    //         }
    //         return prev;
    //       },
    //       0
    //     )
    //   : task.todoChecklist;
    const attachments = req.body?.attachments || task.attachments;
    const updatedTask = await task.updateOne({
      title,
      description,
      status,
      todoChecklist,
      attachments,
    });
    return res.json({
      ...task.toObject(),
      title,
      description,
      status,
      todoChecklist,
      attachments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error, ", error });
  }
};
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).json({ message: "task id is required!" });
    const task = await taskModel.findById(id);
    if (!task) return res.status(404).json({ message: "task not found" });
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ message: "not athorized!!" });

    const { userId, role } = (await jwt.decode(token)) as TokenPayload;

    if (!userId) return res.status(409).json({ message: "not athorized!!" });
    if (!task?.assignedTo.find((t) => t.equals(userId)) && role !== "admin")
      return res.status(409).json({ message: "not athorized!!" });

    const infpo = await task.deleteOne();
    return res.json(infpo);
  } catch (error) {
    return res.status(500).json({ message: "server error, ", error });
  }
};
export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(404).json({ message: "task id is required!" });

    const task = await taskModel.findById(id);
    if (!task) return res.status(404).json({ message: "task not found" });
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ message: "not athorized!!" });

    const { userId, role } = (await jwt.decode(token)) as TokenPayload;

    if (!userId) return res.status(409).json({ message: "not athorized!!" });
    if (!task?.assignedTo.find((t) => t.equals(userId)) && role !== "admin")
      return res.status(409).json({ message: "not athorized!!" });
    const status = req.body?.status;
    if (!status) return res.status(400).json("feild are required");
    if (status === "Completed") {
      task.todoChecklist.forEach((todo) => (todo.completed = true));
    }
    task.status = status;
    task.save();

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: "server error, ", error });
  }
};
export const updateTaskChecklist = async (req: Request, res: Response) => {
  try {
    //console.log(req.params.id);
    const id = req.params.id;
    if (!id) return res.status(404).json({ message: "task id is required!" });

    const task = await taskModel.findById(id);
    if (!task) return res.status(404).json({ message: "task not found" });
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(409).json({ message: "not athorized!!" });

    const { userId, role } = (await jwt.decode(token)) as TokenPayload;

    if (!userId) return res.status(409).json({ message: "not athorized!!" });
    if (!task?.assignedTo.find((t) => t.equals(userId)) && role !== "admin")
      return res.status(409).json({ message: "not athorized!!" });
    const todos = req.body?.todos;

    if (!todos) {
      return res.status(400).json({ message: "feild are required" });
    }

    let checkConfirmity = Array.isArray(todos) && todos.length;
    todos.forEach((todo: TodoType) => {
      if (!isTodo(todo)) {
        checkConfirmity = false;
        return;
      }
    });
    if (!checkConfirmity) {
      return res
        .status(400)
        .json({ message: "please provide a correct data!!" });
    }
    const completedTasks = todos.filter((t: any) => t.completed).length || 0;
    const status =
      completedTasks === 0
        ? "Pending"
        : completedTasks === task?.todoChecklist.length
        ? "Completed"
        : "In Progress";
    task.todoChecklist = todos;
    task.status = status;
    task.progress = todos.reduce((acc: number, cur: TodoType) => {
      if (cur.completed) acc += 100 / todos.length;
      return acc;
    }, 0);

    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error, ", error });
  }
};
