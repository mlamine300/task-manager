/* eslint-disable @typescript-eslint/no-explicit-any */

import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const TaskPieChart = ({ data }: { data: any }) => {
  const COLORS = {
    Pending: "#FF8042",
    "In Progress": "#FFBB28",
    Completed: "#00C49F",
  };
  const isItPhone = window.innerWidth < 500;

  return (
    <div className="flex flex-col">
      <p className="font-semibold text-sm">Task Distribution</p>
      <PieChart
        width={400}
        height={400}
        className="flex justify-center items-center  self-center"
      >
        <Pie
          cx="50%"
          cy="50%"
          data={data}
          innerRadius={120}
          dataKey="count"
          outerRadius={150}
          fill="green"
          style={{ cursor: "pointer", outline: "none" }}
        >
          {data.map((entry: any, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry?.name
                  ? COLORS[entry.name as keyof typeof COLORS]
                  : COLORS.Pending
              }
            />
          ))}
        </Pie>
        <Legend
          layout={isItPhone ? "vertical" : "horizontal"}
          verticalAlign="bottom"
          align={isItPhone ? "center" : "right"}
          iconType="line"
          fontSizeAdjust={0.5}
          iconSize={8}
        />
        <Tooltip
          formatter={(value: any) => {
            return <span className={`font-semibold `}>{value}</span>;
          }}
          contentStyle={{
            borderRadius: "4px",
            border: "1px solid #ccc",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            fontSize: "12px",
            gap: "4px",
          }}
          itemStyle={{ fontSize: "12px" }}
        />
      </PieChart>
    </div>
  );
};

export default TaskPieChart;
