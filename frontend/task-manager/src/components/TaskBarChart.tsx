import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* eslint-disable @typescript-eslint/no-explicit-any */
const TaskBarChart = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col  justify-between  h-full">
      <p className="font-semibold text-sm">Task PriorityLevels</p>

      <BarChart
        className="self-center"
        accessibilityLayer
        barCategoryGap="10%"
        barGap={4}
        data={data}
        height={350}
        syncMethod="index"
        width={400}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis dataKey={"count"} />
        <Legend />
        <Tooltip defaultIndex={3} />
        <Bar
          style={{ borderRadius: "10", color: "red" }}
          //   activeBar={<Rectangle fill="pink" stroke="blue" radius={20} />}
          dataKey="count"
          fill="#6EBF8B"
          radius={[5, 5, 0, 0]}
        />
      </BarChart>
    </div>
  );
};

export default TaskBarChart;
