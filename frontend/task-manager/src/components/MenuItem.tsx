/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ReactElement } from "react";
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
  return (
    <Link
      to={item.path}
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
