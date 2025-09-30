/* eslint-disable @typescript-eslint/no-explicit-any */

import { useLocation } from "react-router";
import SideBar from "../components/SideBar";

const DashboardLayout = ({ children }: { children: any }) => {
  const location = useLocation();
  const activeMenu = location.pathname.split("/")[2] || "dashboard";
  return (
    <section className="w-full  h-full min-h-svh flex flex-row ">
      <SideBar type="admin" activeMenu={activeMenu} />

      <main className=" my-16 w-full px-5   flex  h-full">{children}</main>
    </section>
  );
};

export default DashboardLayout;
