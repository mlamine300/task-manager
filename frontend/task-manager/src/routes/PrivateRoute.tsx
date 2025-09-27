import { Outlet } from "react-router-dom";
import Fouter from "../components/Fouter";
import Header from "../components/Header";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  if (allowedRoles.includes("admin"))
    return (
      <div className="w-full h-full">
        <Header />
        <Outlet />
        <Fouter />
      </div>
    );

  return <div className="text-gray-600 text-7xl">404</div>;
};

export default PrivateRoute;
