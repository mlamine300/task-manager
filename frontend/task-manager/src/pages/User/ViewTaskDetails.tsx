/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import DashboardLayout from "../../layouts/DashboardLayout";
import type { Task } from "../../types";
import { Link, useNavigate, useParams } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import NotFound from "../../components/NotFound";
import moment from "moment";
import UsersAssignedTo from "../../components/UsersAssignedTo";
import Spinner from "../../components/Spinner";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import Button from "../../components/ui/Button";

const ViewTaskDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pending, setPending] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const count = task?.todoChecklist
    ? task?.todoChecklist.filter((t) => t.completed).length
    : 0;

  const status =
    count === 0
      ? "Pending"
      : count === task?.todoChecklist.length
      ? "Completed"
      : "In Progress";
  useEffect(() => {
    if (status != task?.status) {
      setTask((task) => ({ ...task!, status: status as Task["status"] }));
    }
    console.log("-----------");
  }, [task]);

  useEffect(() => {
    if (!id) {
      setPending(false);
      return;
    }
    const fetchTask = async () => {
      try {
        const data = await axiosInstance.get(API_PATH.TASK.GET_TASK_BY_ID(id));
        if (data.data) setTask(data.data);
        else toast.error("error fetching task..");
      } catch (error) {
        toast.error("error fetching task..");
        console.log(error);
      }

      setPending(false);
    };
    fetchTask();
  }, [id]);

  const updateTask = async () => {
    if (!id) return;
    try {
      const data = await axiosInstance.put(
        API_PATH.TASK.UPDATE_TASK_CHECKLIST(id),
        { todos: task?.todoChecklist }
      );
      if (data.status === 200) {
        toast.success("Task updated!!");
        navigate("/tasks");
      }
    } catch (error: any) {
      toast.error("error on updateing task");
      console.log(error);
    }
  };

  const statuscolor =
    task?.status === "Completed"
      ? "text-teal-500 bg-teal-500/10 border border-teal-500/30"
      : task?.status == "Pending"
      ? "text-purple-700 bg-purple-700/10 border border-purple-700/30"
      : "text-indigo-600 bg-indigo-600/10 border border-indigo-600/30 ";

  if (!task && !pending) return <NotFound />;
  return (
    <DashboardLayout>
      {pending ? (
        <Card className="max-w-[800px] h-96 w-full flex justify-center items-center">
          <Spinner size="xl" />
        </Card>
      ) : (
        <Card className="p-4 max-w-[500px] lg:max-w-[800px] w-full gap-2 flex flex-col">
          <div className="flex justify-between">
            <h4>{task?.title}</h4>
            <p
              className={`h-fit flex items-center justify-center text-sm lg:text-lg rounded px-2 py-px ${statuscolor}`}
            >
              {task?.status}
            </p>
          </div>
          <div>
            <p className="text-sm lg:text-lg font-semibold text-gray-500">
              Description
            </p>
            <p className="text-sm lg:text-lg">{task?.description}</p>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <div className="flex flex-col w-36">
              <p className="text-gray-700 text-sm lg:text-lg">Priority</p>
              <p className=" text-sm lg:text-lg font-semibold">
                {task?.priority}{" "}
              </p>
            </div>
            <div className="flex flex-col w-36">
              <p className="text-gray-700 text-sm lg:text-lg">Due Date</p>
              <p className=" text-sm lg:text-lg font-semibold">
                {moment(task?.dueDate).format("Do MMM yyy")}{" "}
              </p>
            </div>
            <div className="flex flex-col w-36">
              <p className="text-gray-700 text-sm lg:text-lg">Assigned to</p>
              <UsersAssignedTo
                imgClassName="w-8 h-8"
                assignedTo={task?.assignedTo.slice(0, 3) || []}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-sm lg:text-lg font-semibold text-gray-500 my-1 ">
              Todo Checklist
            </p>
            <div className="flex flex-col gap-3">
              {task?.todoChecklist.map((td, index) => (
                <div className="flex items-center gap-2 " key={index}>
                  <input
                    id={index + ""}
                    type="checkbox"
                    checked={td.completed}
                    onChange={(e) => {
                      setTask({
                        ...task,
                        todoChecklist: task.todoChecklist.map((to, tindex) => {
                          if (tindex === index) {
                            return {
                              text: to.text,
                              completed: e.target.checked,
                            };
                          }
                          return to;
                        }),
                      });
                    }}
                  />
                  <label
                    className="text-sm lg:text-lg select-none cursor-pointer"
                    htmlFor={index + ""}
                  >
                    {td.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {task?.attachments && task.attachments.length > 0 && (
            <div className="flex flex-col">
              <p className="text-sm lg:text-lg font-semibold text-gray-500 my-1 ">
                Attachments
              </p>
              <div className="flex flex-col gap-2">
                {task?.attachments?.map((att, index) => (
                  <Link
                    to={att}
                    target="_blank"
                    className="w-full h-8 bg-gray-cold/10 rounded items-center px-2 gap-2 flex"
                  >
                    <p className="text-xs text-gray-cold font-semibold">
                      {index < 10 ? `0${index + 1}` : `${index + 1}`}
                    </p>
                    <p className="text-[11px] font-semibold truncate w-full grow">
                      {att}{" "}
                    </p>
                    <HiArrowTopRightOnSquare className="text-lg text-gray-500 font-bold" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          <Button
            className="my-2"
            text="UPDATE"
            variant="primary"
            onClick={() => {
              updateTask();
            }}
          />
        </Card>
      )}
    </DashboardLayout>
  );
};

export default ViewTaskDetails;
