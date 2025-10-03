/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Input from "../../components/ui/Input";
import { useEffect, useState } from "react";
import PriorityLevel from "../../components/PriorityLevel";
import type { priorityLevel, Task, TodoType, User } from "../../types";
import AssignTo from "../../components/AssignTo";
import TodoCheckList from "../../components/TodoCheckList";
import AddAttachments from "../../components/AddAttachments";
import Button from "../../components/ui/Button";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { HiOutlineTrash } from "react-icons/hi2";
import Modal from "../../components/ui/Modal";

const TaskForm = () => {
  const { taskId } = useParams<{ taskId?: string }>();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState<priorityLevel>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState<User[]>([]);
  const [todoList, setTodoList] = useState<TodoType[]>([]);
  const [attachements, setAttachements] = useState<string[]>([]);
  const [error, setError] = useState<any>(null);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  // Fetch task if taskId exists
  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      try {
        const { data } = await axiosInstance.get(
          API_PATH.TASK.GET_TASK_BY_ID(taskId)
        );
        if (data) {
          setTaskTitle(data.title ?? "");
          setTaskDescription(data.description ?? "");
          setPriority(data.priority ?? "Medium");
          setDueDate(
            data.dueDate
              ? new Date(data.dueDate).toISOString().split("T")[0]
              : ""
          );
          setAssignedTo(data.assignedTo ?? []);
          setTodoList(data.todoChecklist ?? []);
          setAttachements(data.attachments ?? []);
        } else {
          navigate("/create-task");
        }
      } catch (err) {
        console.error("Error fetching task:", err);
      }
    };

    fetchTask();
  }, [taskId]);

  const actionAllowed =
    !taskTitle.trim() ||
    !taskDescription.trim() ||
    !dueDate ||
    pending ||
    assignedTo.length === 0 ||
    todoList.length === 0;

  const resetForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setPriority("Medium");
    setDueDate("");
    setAssignedTo([]);
    setTodoList([]);
    setAttachements([]);
    setError(null);
  };

  const handleSubmit = async () => {
    setPending(true);

    const taskData: Task = {
      title: taskTitle,
      description: taskDescription,
      priority,
      dueDate: new Date(dueDate),
      assignedTo,
      attachments: attachements,
      todoChecklist: todoList,
    };

    try {
      if (taskId) {
        // Update existing task
        const { data, status } = await axiosInstance.put(
          API_PATH.TASK.UPDATE_TASK(taskId),
          taskData
        );

        if (status === 200) {
          toast.success("task updated successfully");
          resetForm();
          navigate("/create-task");
        } else if (data?.errors) {
          setError(data.errors);
        }
      } else {
        // Create new task
        const { data, status } = await axiosInstance.post(
          API_PATH.TASK.CREATE_TASK,
          taskData
        );

        if (status === 201) {
          toast.success("Task created successfully");
          resetForm();
        } else if (data?.errors) {
          setError(data.errors);
        }
      }
    } catch (err) {
      console.error("Error saving task:", err);
    } finally {
      setPending(false);
    }
  };
  const [showDelete, setShowDelete] = useState(false);
  const deleteTask = async () => {
    if (!taskId) {
      toast.error("task not found!");
      setShowDelete(false);
      return;
    }
    try {
      setPending(true);
      const data = await axiosInstance.delete(
        API_PATH.TASK.DELETE_TASK(taskId)
      );
      if (data.status === 200) {
        toast.success("task deleted succesufuly");
        setShowDelete(false);
        resetForm();
        navigate("/create-task");
        return;
      } else toast.error("error on deleting task");
    } catch (error) {
      toast.error("error on deleting task");
      console.error(error);
    }
    setPending(false);
  };
  return (
    <DashboardLayout>
      <Card className="flex flex-col max-md:w-full rounded-lg gap-4 px-5 max-w-[900px]">
        {taskId ? (
          <div className="flex items-center justify-between">
            <h4>Update Task</h4>
            <button
              onClick={() => setShowDelete(true)}
              className="group cursor-pointer hover:scale-110 transition text-red-500 flex items-center gap-2 px-2 py-1 text-sm border rounded-sm border-red-500"
            >
              <HiOutlineTrash className="text-red-500 text-lg group-hover:rotate-12 transition" />
              DELETE
            </button>
          </div>
        ) : (
          <h4>Create Task</h4>
        )}

        <Input
          disabled={pending}
          parentClassName="gap-0"
          containerClassName="bg-slate-50/50"
          label="Task Title"
          placeHolder="Enter task title"
          key="task-title"
          type="text"
          error={error?.taskTitle || ""}
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />

        <Input
          disabled={pending}
          inputClassName="h-20"
          parentClassName="gap-0"
          containerClassName="bg-slate-50/50"
          label="Task description"
          placeHolder="Enter task description"
          key="task-description"
          type="area"
          error={error?.taskDescription || ""}
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />

        <div className="flex gap-4 md:gap-10 lg:gap-20 flex-wrap md:flex-nowrap">
          <PriorityLevel value={priority} onChange={setPriority} />

          <Input
            disabled={pending}
            parentClassName="gap-0 max-md:flex-row max-md:items-center max-md:gap-4"
            containerClassName="bg-slate-50/50"
            label="Due Date"
            key="due-date"
            type="date"
            placeHolder="Select due date"
            error={error?.dueDate || ""}
            value={dueDate || ""}
            labelClassName="text-md max-md:w-24"
            onChange={(e) => setDueDate(e.target.value)}
          />
          <AssignTo selectedUsers={assignedTo} setter={setAssignedTo} />
        </div>

        <TodoCheckList todoList={todoList} setTodoList={setTodoList} />
        <AddAttachments
          attachements={attachements}
          setAttachments={setAttachements}
        />

        <Button
          onClick={handleSubmit}
          disabled={actionAllowed}
          text={taskId ? "UPDATE TASK" : "CREATE TASK"}
          variant="primary"
        />
      </Card>
      <Modal
        showModal={showDelete}
        title={`delete Task: ${taskId}`}
        close={() => setShowDelete(false)}
        className="h-56"
      >
        <div className="flex flex-col justify-arround h-full">
          <h4 className="text-lg font-normal mt-2">
            Are you sure you went to delete this task?
          </h4>
          <div className="mb-8 mt-auto flex justify-between p-10">
            <button
              onClick={() => setShowDelete(false)}
              className="rounded px-2 py-1 border border-gray-500 bg-gray-400/20"
            >
              CANCEL
            </button>
            <button
              onClick={() => deleteTask()}
              className="rounded text-red-800 px-2 py-1 border border-red-800 bg-red-400/20"
            >
              DELETE
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default TaskForm;
