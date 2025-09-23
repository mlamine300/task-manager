import { Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  if (allowedRoles.includes("admin")) return <Outlet />;

  return <div className="text-gray-600 text-7xl">404</div>;
};

export default PrivateRoute;
