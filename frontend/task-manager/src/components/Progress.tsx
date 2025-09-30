import React from "react";
import type { TodoType } from "../types";

const Progress = ({
  todos,
  status,
}: {
  todos: TodoType[];
  status: "Pending" | "In Progress" | "Completed";
}) => {
  return (
    <div className="w-full h-2 bg-gray-400/50 rounded-full">
      <div
        className={`h-2 rounded-full bg-primary `}
        style={{
          width: `${
            status === "Completed"
              ? "100"
              : (todos.filter((t) => t.completed).length * 100) / todos.length
          }%`,
        }}
      ></div>
    </div>
  );
};

export default Progress;
