/* eslint-disable @typescript-eslint/no-explicit-any */

import { twMerge } from "tailwind-merge";

const Button = ({
  text,
  onClick,
  variant,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  text: string;
  variant: "primary" | "outline";
}) => {
  const primary =
    "bg-primary p-1 hover:bg-primary/50 disabled:bg-gray-cold/70 rounded text-lg text-text-accent cursor-pointer";
  const outline =
    " border-primary text-primary rounded font-sembold border-2 text-lg p-1 hover:text-primary/50 hover:border-primary/50 disabled:border-gray-cold/70 disabled:text-gray-cold/70 cursor-pointer";
  const variantObject = { primary, outline };
  return (
    <button
      {...props}
      className={twMerge(variantObject[variant] || primary, className)}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
