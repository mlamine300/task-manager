/* eslint-disable @typescript-eslint/no-explicit-any */

import { twMerge } from "tailwind-merge";

const Card = ({
  children,
  className,
}: {
  children: any;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "bg-background-base rounded-xl shadow-sm shadow-gray-cold p-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
