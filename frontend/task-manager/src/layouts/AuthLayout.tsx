import type { ReactElement } from "react";
import Image from "../assets/auth-side-img.png";

const AuthLayout = ({ children }: { children: ReactElement }) => {
  return (
    <div className="flex flex-row w-full   h-full">
      <div className="w-full  md:w-[60%] h-full flex flex-col justify-around p-10">
        <h4>Task Manager</h4>
        {children}
      </div>
      <div className="hidden md:w-[40%] md:flex items-center  justify-center">
        <img
          src={Image}
          alt="auth-side-img"
          className="w-full h-full bg-cover object-cover"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
