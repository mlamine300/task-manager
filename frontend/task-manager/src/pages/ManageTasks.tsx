/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import type { Task } from "../types";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";

import TaskCard from "../components/TaskCard";
import { HiDocumentReport } from "react-icons/hi";
import toast from "react-hot-toast";

const ManageTasks = () => {
  const role = localStorage.getItem("role") || "member";
  const status = ["All", "Pending", "In Progress", "Completed"];
  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeFilter, setActiveFilter] = useState<
    "All" | "Pending" | "In Progress" | "Completed"
  >("All");
  const filteredTasks = tasks.filter((t) =>
    activeFilter === "All" ? true : t.status === activeFilter
  );
  const tasksCount = status.reduce((prev, s) => {
    return {
      ...prev,
      [s]:
        s === "All" ? tasks.length : tasks.filter((t) => t.status === s).length,
    };
  }, {} as Record<string, number>);
  const downloadReport = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATH.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });
      if (!data) {
        toast.error("error downloading report");
        return;
      }
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.append(link);
      link.click();
      link.parentElement?.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("error downloading report");
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axiosInstance.get(API_PATH.TASK.GET_ALL_TASKS);
      if (response.status === 200) setTasks(response.data);
    };
    fetchTasks();
  }, []);
  return (
    <DashboardLayout>
      <div className="flex flex-col p-8  w-full">
        <div className="flex items-center flex-col justify-center sm:flex-row">
          <p className="font-semibold text-xl sm:mr-auto">My Tasks</p>
          <div className="flex gap-4 items-center">
            {status.map((s: string) => {
              return (
                <div
                  onClick={() => setActiveFilter(s as any)}
                  className={`cursor-pointer flex gap-1 sm:gap-2 border-primary px-1 py-1 ${
                    activeFilter === s ? "border-b-2" : ""
                  }`}
                >
                  <p className="text-xs text-nowrap md:text-sm">{s}</p>
                  <p
                    className={`w-5 h-5 flex items-center rounded-full justify-center text-xs ${
                      activeFilter === s
                        ? "bg-primary  text-text-accent"
                        : "bg-gray-cold/50"
                    } `}
                  >
                    {tasksCount[s]}
                  </p>
                </div>
              );
            })}
            {role === "admin" && (
              <button
                onClick={() => downloadReport()}
                className="flex ml-4 gap-2 bg-lime-500/30 hover:bg-lime-500/50 items-center px-2 py-1 rounded"
              >
                <HiDocumentReport />
                Download Report
              </button>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-md:place-items-center ">
          {filteredTasks.map((task: Task) => {
            return <TaskCard className="" key={task._id} task={task} />;
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
