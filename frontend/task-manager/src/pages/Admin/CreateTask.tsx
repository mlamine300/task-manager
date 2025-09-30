/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import Input from "../../components/ui/Input";
import { useState } from "react";
import PriorityLevel from "../../components/PriorityLevel";
import type { priorityLevel, Task, TodoType, User } from "../../types";
import AssignTo from "../../components/AssignTo";
import TodoCheckList from "../../components/TodoCheckList";
import AddAttachments from "../../components/AddAttachments";
import Button from "../../components/ui/Button";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
const CreateTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState<priorityLevel>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState<User[]>([]);
  const [todoList, setTodoList] = useState<TodoType[]>([]);
  const [attachements, setAttachements] = useState<string[]>([]);
  const [error, setError] = useState<any>(null);
  const [pending, setPending] = useState(false);

  const actionAllowed =
    !taskTitle.trim() ||
    !taskDescription.trim() ||
    !dueDate ||
    pending ||
    assignedTo.length === 0 ||
    todoList.length === 0;
  const createTask = async () => {
    setPending(true);

    const taskData: Task = {
      title: taskTitle,
      description: taskDescription,
      priority,
      dueDate: new Date(dueDate),
      assignedTo: assignedTo,
      attachments: attachements,
      todoChecklist: todoList,
    };
    try {
      const data = await axiosInstance.post(
        API_PATH.TASK.CREATE_TASK,
        taskData
      );
      if (data?.data?.errors) {
        alert("Failed to create task. Please check the form for errors.");
        console.log(data?.data?.errors);
      }
      if (data?.status === 201) {
        setTaskTitle("");
        setTaskDescription("");
        setPriority("Medium");
        setDueDate("");
        setAssignedTo([]);
        setTodoList([]);
        setAttachements([]);
        setError(null);
      } else if (data?.data?.errors) {
        setError(data?.data?.errors);
      }
    } catch (error) {
      console.log(error);
    }

    setPending(false);
  };

  return (
    <DashboardLayout>
      <Card className="flex flex-col  max-md:w-full rounded-lg gap-4 px-5 max-w-[900px]">
        <h4>Create Task</h4>
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
          error={error?.taskdescription || ""}
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />

        <div className="flex gap-4 md:gap-10 lg:gap-20 flex-wrap md:flex-nowrap ">
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
          <AssignTo
            selectedUsers={assignedTo}
            setter={(user: User[]) => setAssignedTo(user)}
          />
        </div>
        <TodoCheckList todoList={todoList} setTodoList={setTodoList} />
        <AddAttachments
          attachements={attachements}
          setAttachments={setAttachements}
        />
        <Button
          onClick={() => createTask()}
          disabled={actionAllowed}
          text="CREATE TASK"
          variant="primary"
        />
      </Card>
    </DashboardLayout>
  );
};

export default CreateTask;
