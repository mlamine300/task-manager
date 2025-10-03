/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from "react-router";

const MenuItem = ({
  item,
  choosed,
}: {
  item: {
    id: string;
    label: string;
    icon: any;
    path: string;
  };

  choosed: boolean;
}) => {
  const Icon = item.icon;
  // if (item.path === "/logout") {
  //   const LogOut=()=>{

  //   }
  //   return (
  //     <Link  onClick={()=>LogOut()} className="flex flex-row p-2 items-center gap-4 text-lg my-1 cursor-pointer text-text-primary/90">
  //       <Icon className={""} />
  //       <p className="text-sm">{item.label} </p>
  //     </Link>
  //   );
  // }
  return (
    <Link
      onClick={() => {
        if (item.path === "/logout") {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      }}
      to={item.path === "/logout" ? "/login" : item.path}
      className={`flex flex-row p-2 items-center gap-4 text-lg my-1 cursor-pointer ${
        choosed
          ? "text-primary bg-primary/10 border-r-2 border-primary "
          : "text-text-primary/90"
      }`}
    >
      <Icon className={""} />
      <p className="text-sm">{item.label} </p>
    </Link>
  );
};

export default MenuItem;
