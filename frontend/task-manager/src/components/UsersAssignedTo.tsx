import { twMerge } from "tailwind-merge";
import type { User } from "../types";
import { getRandomColor } from "../utils/helper";

const UsersAssignedTo = ({
  assignedTo,
  className,
}: {
  assignedTo: User[];
  className?: string;
}) => {
  return (
    <div className={twMerge("flex items-center", className)}>
      {assignedTo.map((user) => {
        return user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            className="w-10 h-10 rounded-full  object-cover"
          />
        ) : (
          <div
            className="w-10 h-10 text-3xl rounded-full flex items-center justify-center text-gray-600"
            style={{ backgroundColor: getRandomColor() }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        );
      })}
    </div>
  );
};

export default UsersAssignedTo;
