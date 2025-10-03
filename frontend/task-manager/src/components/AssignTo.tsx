/* eslint-disable @typescript-eslint/no-explicit-any */

import { FaUsers } from "react-icons/fa6";

import { useState } from "react";
import Modal from "./ui/Modal";
import SelectUsers from "./SelectUsers";
import type { User } from "../types";
import { getColorFromName } from "../utils/helper";

const AssignTo = ({
  selectedUsers,
  setter,
}: {
  selectedUsers: any;
  setter: (Userrs: User[]) => void;
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="flex md:flex-col min-w-52  max-md:items-center max-md:gap-4  md:flex-nowrap  w-full  ">
      <label className="text-md  max-md:w-24 text-nowrap">Assign To</label>
      <div className="relative flex gap-2 items-center">
        <button
          onClick={() => {
            setShowModal(true);
          }}
          className=" w-fit  text-nowrap text-sm max-md:w-44 h-10 flex gap-2 items-center rounded bg-gray-400/20 px-2 py-1 font-semibold cursor-pointer border border-gray-200 hover:bg-gray-400/10 active:scale-95 transition"
        >
          <FaUsers className="text-2xl text-gray-400 hover:text-gray-600 mr-4" />
          Add Members
        </button>
        {selectedUsers.length > 0 && (
          <div className="max-md:absolute top-[80%] left-[80%] flex  gap-2 mt-2 max-md:mt-0 overflow-hidden w-full">
            {selectedUsers.slice(0, 3).map((user: User) => (
              <div className="  w-10 h-10  -mr-8  rounded-full" key={user._id}>
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    className="w-10 h-10 rounded-full  object-cover"
                  />
                ) : (
                  <div
                    className="w-10 h-10 text-3xl rounded-full flex items-center justify-center text-gray-600"
                    style={{ backgroundColor: getColorFromName(user.name) }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        title="Select Users"
        close={() => setShowModal(false)}
        showModal={showModal}
      >
        <SelectUsers
          close={() => setShowModal(false)}
          selectedUsers={selectedUsers}
          setter={setter}
        />
      </Modal>
    </div>
  );
};

export default AssignTo;
