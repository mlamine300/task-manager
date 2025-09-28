/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import SideBar from "../components/SideBar";

const DashboardLayout = ({
  children,
  activeMenu,
}: {
  children: any;
  activeMenu: string;
}) => {
  return (
    <section className="w-full h-full min-h-svh flex flex-row ">
      <SideBar type="admin" activeMenu={activeMenu} />

      <main className=" w-full h-full">{children}</main>
    </section>
  );
};

export default DashboardLayout;
