import { twMerge } from "tailwind-merge";
import type { User } from "../../../../types/index";
import { getColorFromName } from "../utils/helper";

const UsersAssignedTo = ({
  assignedTo,
  className,
  imgClassName,
}: {
  assignedTo: User[];
  className?: string;
  imgClassName?: string;
}) => {
  return (
    <div className={twMerge("flex items-center", className)}>
      {assignedTo.map((user) => {
        return user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            className={twMerge(
              "w-10 h-10 rounded-full  object-cover",
              imgClassName
            )}
          />
        ) : (
          <div
            className={twMerge(
              "w-10 h-10 text-3xl rounded-full flex items-center justify-center text-gray-too-cold",
              imgClassName
            )}
            style={{ backgroundColor: getColorFromName(user.name) }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        );
      })}
    </div>
  );
};

export default UsersAssignedTo;
