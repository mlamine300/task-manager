import { Request, Response } from "express";
import excelJs from "exceljs";
import taskModel from "../models/Task.ts";
import { format } from "date-fns";
import userModel from "../models/User.ts";

export const generateTaskReport = async (req: Request, res: Response) => {
  try {
    const tasks = (await taskModel
      .find()
      .populate("assignedTo", "name email")) as any;
    if (!tasks || !Array.isArray(tasks) || !tasks.length)
      return res.status(404).json({ message: "there is no task to export!" });

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");
    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Titile", key: "titile", width: 25 },
      { header: "Description", key: "description", width: 55 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
    ];
    tasks.forEach((task) => {
      const assignedTo = task.assignedTo.map(
        (user: { name: string; email: string }) =>
          `${user.name} (${user.email})`
      );
      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Unassigned",
      });
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    const now = format(new Date(), "yyyyMMdd_HHmmss");

    res.setHeader(
      "Content-Disposition",
      `attachment;filename=tasks_report-${now}.xlsx`
    );
    return workbook.xlsx.write(res).then(() => res.end());
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error!!" });
  }
};
export const generateUserReport = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find().select("name email _id").lean().exec();

    if (!users || !Array.isArray(users) || !users.length)
      return res.status(404).json({ message: "there is no task to export!" });

    const usersTasks = await taskModel
      .find()
      .populate("assignedTo", "name email _id");
    const userTaskMap = {} as any;
    users.forEach((user) => {
      userTaskMap[user._id + ""] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });
    usersTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id + ""]) {
            userTaskMap[assignedUser._id + ""].taskCount += 1;
            if (task.status === "Pending")
              userTaskMap[assignedUser._id + ""].pendingTasks += 1;
            else if (task.status === "In Progress")
              userTaskMap[assignedUser._id + ""].inProgressTasks += 1;
            else if (task.status === "Completed")
              userTaskMap[assignedUser._id + ""].completedTasks += 1;
          }
        });
      }
    });
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");
    worksheet.columns = [
      { header: "User Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Total Assigned Tasks", key: "taskCount", width: 25 },
      { header: "Pending Tasks", key: "pendingTasks", width: 25 },
      { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
      { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];
    Object.values(userTaskMap).forEach((user) => {
      worksheet.addRow(user);
    });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    const now = format(new Date(), "yyyyMMdd_HHmmss");

    res.setHeader(
      "Content-Disposition",
      `attachment;filename=user_report-${now}.xlsx`
    );

    return workbook.xlsx.write(res).then(() => res.end());
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error!!" });
  }
};
