import React from "react";
import type { TodoType } from "../types";

import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";

const TodoCheckList = ({
  todoList,
  setTodoList,
}: {
  todoList: TodoType[];
  setTodoList: (list: TodoType[]) => void;
}) => {
  const [inputValue, setInputValue] = React.useState("");
  return (
    <div className="flex flex-col my-2 gap-2">
      <p className="text-lg">TODO Checklist</p>
      <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
        {todoList.map((todo, index) => (
          <div
            key={index}
            className="font-medium flex items-center gap-2 px-4 py-1 border bg-gray-200/50 border-gray-200/20 rounded"
          >
            <p className="text-sm text-gray-400 font-semibold">
              {index < 10 ? `0${index + 1}` : index + 1}
            </p>
            {todo.text}{" "}
            <HiOutlineTrash
              onClick={() => {
                setTodoList(todoList.filter((_, i) => i !== index));
              }}
              className=" ml-auto mr-2 text-red-500 text-lg hover:cursor-pointer hover:rotate-30 transition"
            />
          </div>
        ))}
      </div>
      <form className="flex flex-col gap-2 md:flex-row md:gap-4 items-center">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          placeholder="Enter Task"
          className="border border-gray-200/50 rounded p-2 px-4 bg-slate-50/50 focus:border-primary outline-0 w-full"
        />
        <button
          disabled={!inputValue.trim()}
          onClick={() => {
            if (!inputValue.trim()) return;
            setTodoList([...todoList, { text: inputValue, completed: false }]);
            setInputValue("");
          }}
          className="flex gap-4 items-center rounded bg-gray-400/20 py-1 cursor-pointer border border-gray-200 hover:bg-gray-400/10 active:scale-95 transition  disabled:cursor-not-allowed px-4"
        >
          <HiOutlinePlus className="text-2xl text-gray-400 hover:text-gray-600" />
          Add
        </button>
      </form>
    </div>
  );
};

export default TodoCheckList;
