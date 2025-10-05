/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { User } from "../types";
import { API_PATH } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { getColorFromName } from "../utils/helper";
import Button from "./ui/Button";

const SelectUsers = ({
  selectedUsers,
  setter,
  close,
}: {
  selectedUsers: User[];
  setter: (users: User[]) => void;
  close: any;
}) => {
  const [users, setUsers] = useState<User[]>(selectedUsers || []);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  console.log(users);
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      console.log(data.data);
      setAllUsers(data.data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col gap-4  h-[80%]">
      <div className="flex flex-col gap-2 overflow-y-auto">
        {allUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center  w-full gap-4 py-2 border-b border-gray-cold/20"
            onClick={() => setUsers((prev) => [...prev, user])}
          >
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                className="w-15 h-15 rounded-full object-cover"
                alt={user.name}
              />
            ) : (
              <div
                className="min-w-15 w-15 h-15 text-3xl rounded-full flex items-center justify-center text-gray-too-cold"
                style={{ backgroundColor: getColorFromName(user.name) }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex flex-col shrink  overflow-hidden ">
              <h3 className="text-sm font-semibold">{user.name} </h3>
              <p className="text-xs text-gray-cold text-wrap ">{user.email} </p>
            </div>

            <input
              className="ml-auto mr-5"
              type="checkbox"
              name={user._id}
              id={user._id}
              checked={users.find((u) => u._id === user._id) ? true : false}
              onChange={(e) => {
                if (e.target.checked) {
                  setUsers((prev) => [...prev, user]);
                } else {
                  setUsers((prev) => prev.filter((u) => u._id !== user._id));
                }
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-auto gap-4 h-fit">
        <Button
          className="text-sm px-4"
          text="CANCEL"
          variant="shadow"
          onClick={close}
        />
        <Button
          className="text-sm px-4"
          text="DONE"
          variant="primary"
          onClick={() => {
            setter(users);
            close();
          }}
        />
      </div>
    </div>
  );
};

export default SelectUsers;
