import React from "react";

const ItemBadge = ({
  color,
  count,
  label,
}: {
  color: string;
  count: number | 0;
  label: string;
}) => {
  return (
    <div className="flex flex-row gap-2 items-center ">
      <div className={`${color} rounded-full w-3 h-3`}></div>

      <p className="text-sm">
        <span className="font-bold mr-1">{count}</span>
        {label}
      </p>
    </div>
  );
};

export default ItemBadge;
