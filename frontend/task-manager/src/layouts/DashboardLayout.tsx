import React from "react";
import SideBar from "../components/SideBar";

const DashboardLayout = ({ children, activeMenu }) => {
  return (
    <section className="w-full h-full ">
      <SideBar type="admin" activeMenu={activeMenu} />

      <main>{children}</main>
    </section>
  );
};

export default DashboardLayout;
