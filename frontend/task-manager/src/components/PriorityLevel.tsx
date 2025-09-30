/* eslint-disable @typescript-eslint/no-explicit-any */

import type { priorityLevel } from "../types";

const PriorityLevel = ({
  value,
  onChange,
}: {
  value: priorityLevel;
  onChange: any;
}) => {
  return (
    <div className="flex flex-col min-w-52 max-md:flex-row max-md:items-center max-md:gap-4">
      <label className="text-md max-md:w-24">Priority</label>
      <select
        className="max-md:w-44 border outline-0 border-gray-hot/50 rounded p-2 bg-slate-50/50 focus:border-primary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
};

export default PriorityLevel;
