import React from "react";
import type { User } from "../types";
import Card from "./Card";
import { getRandomColor } from "../utils/helper";

const UserCard = ({ user }: { user: User }) => {
  return (
    <Card>
      <div className="flex gap-4 p-2 w-72 items-center">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={user.name}
            className="rounded-full w-12  h-12 object-cover shrink-0"
          />
        ) : (
          <p
            style={{ backgroundColor: getRandomColor() }}
            className="shrink-0 rounded-full w-12 h-12 flex items-center justify-center"
          >
            {" "}
            {user.name.slice(0, 1)}{" "}
          </p>
        )}
        <div className="flex flex-col gap-1 w-fit max-w-56 ">
          <p className="text-sm font-semibold">{user.name} </p>
          <p className="text-gray-400 truncate   text-xs ">{user.email}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-col rounded py-1 bg-gray-400/20 text-purple-500 w-[30%] px-4">
          <p className="text-xs">{user.pendingTask}</p>
          <p className="text-[10px]">Pending</p>
        </div>
        <div className="flex flex-col rounded py-1 bg-gray-400/20 text-teal-400 w-[30%] px-4">
          <p className="text-xs">{user.inProgressTask}</p>
          <p className="text-[9px]">In Progress</p>
        </div>
        <div className="flex px-4 flex-col rounded py-1 bg-gray-400/20 text-indigo-400 w-[30%] ">
          <p className="text-xs">{user.completedTask}</p>
          <p className="text-[10px]">Completed</p>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
