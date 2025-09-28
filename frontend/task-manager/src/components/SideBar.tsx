import React from "react";
import { SIDE_MENU_ADMIN_DATA, SIDE_MENU_USER_DATA } from "../utils/data";
import { useUserContext } from "../context/user/userContext";
import MenuItem from "./MenuItem";
import { useLocation } from "react-router";
interface SideBarProps {
  type: "admin" | "user";
  activeMenu: string;
}
const SideBar = ({ type }: SideBarProps) => {
  const { pathname } = useLocation();
  const menuItems =
    type === "admin" ? SIDE_MENU_ADMIN_DATA : SIDE_MENU_USER_DATA;
  const { user } = useUserContext();

  return (
    <nav className="flex flex-col w-64 border-r-[1px] gap-10 border-gray-200 h-min-lvh bg-white ">
      <div className="flex  flex-col items-center gap-1 mt-8">
        {user?.profileImageUrl ? (
          <img src={user?.profileImageUrl} className="rounded-full w-20 h-20" />
        ) : (
          <p className="rounded-full bg-teal-400 text-white w-20 h-20 items-center justify-center flex text-7xl">
            {user?.name.slice(0, 1).toUpperCase()}
          </p>
        )}
        <p className="text-xs px-2 py-px text-text-accent bg-primary rounded">
          {user?.role}
        </p>
        <p className="font-semibold text-xs">{user?.name} </p>
        <p className="font-light text-gray-500 text-[10px]">{user?.email} </p>
      </div>
      <div>
        {menuItems.map((item, index) => {
          return (
            <MenuItem item={item} key={index} choosed={item.path == pathname} />
          );
        })}
      </div>
    </nav>
  );
};

export default SideBar;
