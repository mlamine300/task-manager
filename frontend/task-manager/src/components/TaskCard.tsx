import React from "react";
import type { Task } from "../types";
import { twMerge } from "tailwind-merge";
import Progress from "./Progress";
import moment from "moment";
import UsersAssignedTo from "./UsersAssignedTo";

const TaskCard = ({ className, task }: { className?: string; task: Task }) => {
  const statusStyle = {
    Pending: "bg-indigo-200 text-indigo-800 border-indigo-400 border",
    "In Progress": "bg-amber-200 text-amber-800 border-amber-400 border",
    Completed: "bg-green-200 text-green-800 border-green-400 border",
  };
  const priorityStyle = {
    Low: "bg-teal-200 text-teal-800 border-teal-400 border",
    Medium: "bg-orange-200 text-orange-800 border-orange-400 border",
    High: "bg-red-200 text-red-800 border-red-400 border",
  };
  return (
    <div
      className={twMerge(
        "bg-white rounded-xl shadow-sm shadow-gray-cold py-4 max-w-96 max-sm:min-w-96",
        className
      )}
    >
      <div className="flex gap-4 mx-4">
        <p
          className={`text-xs px-3 py-1 rounded ${
            statusStyle[task.status || "Pending"]
          }`}
        >
          {task.status}{" "}
        </p>
        <p
          className={`text-xs px-3 py-1 rounded ${
            priorityStyle[task.priority || "Low"]
          }`}
        >
          {task.priority}{" "}
        </p>
      </div>
      <div className="px-4  mt-2   border-l-2 border-primary">
        <p className="text-sm font-semibold">{task.title} </p>
        <p className="text-xs text-gray-400">
          {task.description.length > 100
            ? task.description.slice(0, 100) + "..."
            : task.description}{" "}
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Task Done:{" "}
          <span className="text-text-primary font-semibold">{`${
            task.todoChecklist.filter((t) => t.completed).length
          } / ${task.todoChecklist.length}`}</span>{" "}
        </p>
        <Progress
          todos={task.todoChecklist}
          status={task.status || "Pending"}
        />
      </div>
      <div className="flex justify-between mx-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-600/80 mt-2 ">Start Date</p>
          <p className="text-xs font-semibold">
            {moment(new Date()).format("Do MMM yyyy")}{" "}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-gray-600/80 mt-2 ">Due Date</p>
          <p className="text-xs font-semibold">
            {moment(new Date()).format("Do MMM yyyy")}{" "}
          </p>
        </div>
      </div>
      <UsersAssignedTo className="mx-4" assignedTo={task.assignedTo} />
    </div>
  );
};

export default TaskCard;
