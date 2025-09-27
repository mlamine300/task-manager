import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_ENDPOINT, API_PATH } from "../../utils/apiPaths";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data } = await axiosInstance.get(
        API_PATH.TASK.GET_DASHBOARD_DATA
      );
      console.log(data);
      if (data) setDashboardData(data);
    };
    fetchDashboardData();
  }, []);

  return <DashboardLayout activeMenu="">hola</DashboardLayout>;
};

export default Dashboard;
