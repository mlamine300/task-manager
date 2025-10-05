/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPaths";
import Card from "../components/Card";
import { useUserContext } from "../context/user/userContext";
import moment from "moment";
import ItemBadge from "../components/ItemBadge";
import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa6";
import TaskTable from "../components/TaskTable";
import TaskPieChart from "../components/TaskPieChart";
import TaskBarChart from "../components/TaskBarChart";

const Dashboard = () => {
  const role = localStorage.getItem("role") || "member";
  const [dashboardData, setDashboardData] = useState<any>(null);
  const { user } = useUserContext();
  useEffect(() => {
    const fetchDashboardData = async () => {
      const link =
        role === "admin"
          ? API_PATH.TASK.GET_DASHBOARD_DATA
          : API_PATH.TASK.GET_USER_DASHBOARD_DATA;
      const { data } = await axiosInstance.get(link);
      console.log(data);
      if (data) setDashboardData(data);
    };
    fetchDashboardData();
  }, []);

  const pieChartData = dashboardData?.charts?.taskDistribution
    ? Object.entries(dashboardData.charts.taskDistribution)
        .filter(([key]) => key !== "all")
        .map(([key, value]) => ({ name: key, count: value }))
    : [];
  const taskPriorityLevel = dashboardData?.charts?.taskPriorityLevel ?? null;
  const barChartData =
    taskPriorityLevel !== undefined && taskPriorityLevel !== null
      ? Object.entries(taskPriorityLevel)
          .filter(([key]) => key !== "all")
          .map(([key, value]) => ({ name: key, count: value }))
      : [];

  return (
    <DashboardLayout>
      <div className="flex max-md:items-center bg-background/50 flex-col gap-8 w-full h-full  p-4">
        <Card className=" flex flex-col ">
          <p className="text-lg font-semibold">
            {`Good Morning! `}
            <span className="italic font-bold capitalize text-cold">
              {user?.name}
            </span>
          </p>
          <p className=" text-sm text-gray-too-cold">
            {moment().format("dddd,  Do MMM  YYYY")}
          </p>
          <div className="mt-2  grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <ItemBadge
              color="bg-blue-500"
              label="Total Tasks"
              count={dashboardData?.charts?.taskDistribution?.all}
            />
            <ItemBadge
              color="bg-indigo-500"
              label="Pending Tasks"
              count={dashboardData?.charts?.taskDistribution?.Pending}
            />
            <ItemBadge
              color="bg-teal-400"
              label="In Progress Tasks"
              count={dashboardData?.charts?.taskDistribution?.InProgress}
            />
            <ItemBadge
              color="bg-green-400"
              label="Completed Tasks"
              count={dashboardData?.charts?.taskDistribution?.Completed}
            />
          </div>
        </Card>

        <div className=" gap-5 grid lg:grid-cols-2 justify-around ">
          <Card>
            <TaskPieChart data={pieChartData} />
          </Card>
          <Card>
            <TaskBarChart data={barChartData} />
          </Card>
        </div>
        <Card className="flex flex-col p-4">
          <div className="flex justify-between">
            <p className="font-semibold text-lg">Recent Tasks</p>
            <Link
              to={"/admin/tasks"}
              className="flex gap-2 items-center text-xs rounded bg-gray-cold/20 px-2 py-1 font-semibold border border-gray-hot hover:bg-gray-cold/10"
            >
              See All
              <FaArrowRight />
            </Link>
          </div>
          <TaskTable tasks={dashboardData?.recentTasks} />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
