import React, { useState } from "react";
import { SIDE_MENU_ADMIN_DATA, SIDE_MENU_USER_DATA } from "../utils/data";
import { useUserContext } from "../context/user/userContext";
import MenuItem from "./MenuItem";
import { useLocation } from "react-router";
import { HiBars3 } from "react-icons/hi2";
interface SideBarProps {
  type: "admin" | "user";
  activeMenu: string;
}
const SideBar = ({ type }: SideBarProps) => {
  const { pathname } = useLocation();
  const menuItems =
    type === "admin" ? SIDE_MENU_ADMIN_DATA : SIDE_MENU_USER_DATA;
  const { user } = useUserContext();
  const [showed, setShowed] = useState<boolean>(false);
  return (
    <>
      {/* <button onClick={setShowed((s) => !s)}> */}
      <HiBars3
        className="fixed z-20 left-2 top-5 rounded-full bg-white text-primary md:hidden w-5 h-5 active:rotate-30 transition"
        onClick={() => setShowed((b) => !b)}
      />
      {/* </button> */}
      <aside
        onClick={() => setShowed(false)}
        className={`min-h-lvh  bg-white transition duration-300 ease-in-out  ${
          showed
            ? "fixed h-full  flex flex-col w-full z-10"
            : "relative  mt-10 hidden md:flex flex-col w-64 border-r-[1px] gap-10 border-gray-200 "
        }`}
      >
        <div className="flex  flex-col items-center w-64 gap-1 mt-8">
          {user?.profileImageUrl ? (
            <img
              src={user?.profileImageUrl}
              className="rounded-full w-20 h-20"
            />
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
              <MenuItem
                item={item}
                key={index}
                choosed={item.path == pathname}
              />
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
