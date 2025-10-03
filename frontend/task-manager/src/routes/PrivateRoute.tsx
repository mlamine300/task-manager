import { Outlet, useNavigate } from "react-router-dom";
import Fouter from "../components/Fouter";
import Header from "../components/Header";
import NotAuthorized from "../components/NotAuthorized";

const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  if (!role) {
    navigate("/login");
  }
  if (role && allowedRoles.includes(role))
    return (
      <div className="w-full h-full">
        <Header />
        <Outlet />
        <Fouter />
      </div>
    );

  return <NotAuthorized />;
};

export default PrivateRoute;
