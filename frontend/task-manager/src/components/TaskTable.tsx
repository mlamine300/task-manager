import moment from "moment";
import type { TaskLine } from "../types";
import { Link } from "react-router";

const TaskTable = ({ tasks }: { tasks: TaskLine[] }) => {
  const statusStyle = {
    Completed:
      "text-green-500 bg-green-500/20 rounded px-2 py-1 border border-green-500",
    Pending:
      "text-amber-500 bg-amber-500/20 rounded px-2 py-1 border border-amber-500",
    "In Progress":
      "text-red-500 bg-red-500/20 rounded px-2 py-1 border border-red-500",
  };
  const priorityStyle = {
    Low: "text-green-500 bg-green-500/20 rounded px-2 py-1 border border-green-500",
    Medium:
      "text-amber-500 bg-amber-500/20 rounded px-2 py-1 border border-amber-500",
    High: "text-red-500 bg-red-500/20 rounded px-2 py-1 border border-red-500",
  };
  return (
    <table className="mt-5">
      <thead>
        <tr className="border-b  text-xs lg:text-sm grid md:grid-cols-6 grid-cols-3 border-gray-200/50 py-2">
          <th className="text-left font-semibold md:col-span-3">Name</th>
          <th className="text-left font-semibold">Status</th>
          <th className="text-left font-semibold  hidden md:flex">Priority</th>
          <th className="text-left font-semibold">Created On</th>
        </tr>
      </thead>

      {tasks && Array.isArray(tasks) && tasks.length > 0 ? (
        <tbody className="w-full">
          {tasks.map((task) => (
            <tr>
              <Link
                to={`/admin/tasks/${task._id}`}
                className="text-xs lg:text-sm grid md:grid-cols-6 grid-cols-3 w-full py-2 items-center hover:bg-gray-200/20 hover:border-b border-gray-200/50"
              >
                <td className="text-left md:col-span-3  ">{task.title}</td>
                <td className="text-left md:col-span-1">
                  <p
                    className={`text-xs text-center w-fit ${
                      statusStyle[task.status]
                    }`}
                  >
                    {task.status}
                  </p>
                </td>
                <td className="text-left md:col-span-1   hidden md:flex">
                  {" "}
                  <p
                    className={`text-xs text-center w-fit  ${
                      priorityStyle[task.priority]
                    }`}
                  >
                    {task.priority}
                  </p>{" "}
                </td>
                <td className="text-left md:col-span-1">
                  <p
                    className={`text-xs md:text-sm md:bg-transparent md:border-none md:text-text-primary ${
                      priorityStyle[task.priority]
                    }`}
                  >
                    {moment(task.createdAt).format("Do MMM yyyy")}
                  </p>
                </td>
              </Link>
            </tr>
          ))}
        </tbody>
      ) : (
        <p> No tasks</p>
      )}
    </table>
  );
};

export default TaskTable;
