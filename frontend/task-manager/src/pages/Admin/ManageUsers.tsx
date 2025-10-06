/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import type { User } from "../../../../../types/index";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import UserCard from "../../components/UserCard";
import { HiDocumentReport } from "react-icons/hi";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const downloadReport = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATH.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });
      if (!data) {
        toast.error("error downloading report");
        return;
      }
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
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
    const fetchUsers = async (attemps: number) => {
      try {
        const data = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
        if (data.data) {
          console.log(data.data);
          setUsers(data.data);
          setIsFetching(false);
        }
      } catch (error: any) {
        if (
          error.response.data.message === "Access token expired" &&
          attemps < 3
        ) {
          setTimeout(() => {
            console.log("waiting for refresh", attemps);
            fetchUsers(attemps + 1);
            attemps++;
          }, 1000);
        } else {
          setIsFetching(false);
          console.log("no fetching");
        }
      }
    };
    fetchUsers(0);
  }, []);

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="w-full h-[70svh] flex items-center justify-center">
          <Spinner size="xl" />
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h4>Team Members</h4>
          <button
            onClick={() => downloadReport()}
            className="flex gap-2 bg-lime-500/30 hover:bg-lime-500/50 items-center px-2 py-1 rounded"
          >
            <HiDocumentReport />
            Download Report
          </button>
        </div>
        <div className="flex flex-wrap gap-8">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
