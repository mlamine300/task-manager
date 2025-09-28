import mongoose from "mongoose";
// const mongoose = require("mongoose");
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});
export interface Task {
  title: string;
  description: string;
  priority?: "Low" | "Medium" | "High";
  status?: "Pending" | "In Progress" | "Completed";
  dueDate: Date;
  assignedTo: string;
  createdBy: string;
  attachments?: string[];
  todoChecklist?: TodoType[];
  progress?: number;
}
export interface TodoType {
  text: string;
  completed?: boolean | true;
}
export const isTask = (obj: any): obj is Task => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.title === "string" &&
    typeof obj.description === "string" &&
    typeof obj.assignedTo === "string" &&
    typeof obj.createdBy === "string"
  );
};
export const isTodo = (obj: any): obj is TodoType => {
  return (
    typeof obj === "object" && obj !== null && typeof obj.text === "string"
  );
};
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    dueDate: { type: Date, required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    createdBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    attachments: [{ type: String }],
    todoChecklist: [todoSchema],
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("task", taskSchema);
export default taskModel;
