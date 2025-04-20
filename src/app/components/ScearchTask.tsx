import React, { useState } from "react";
import InputCustom from "./InputCustom";
import { Task } from "@/src/utils/types";

interface Props {
  taskList: Task[];
  handleClick: (task: Task) => void;
}

function ScearchTask({ taskList, handleClick }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    let filtered: Task[] = [];

    if (value) {
      filtered = taskList.filter((task) =>
        task.title.toLowerCase().includes(value.toLowerCase())
      );
    }
    setFilteredTasks(filtered);
  };

  const handleSelectTask = (task: Task) => {
    setSearchTerm(task.title);
    setFilteredTasks([]);
    handleClick(task);
  };

  return (
    <div className="p-4 mb-4 border-b border-gray-300 relative">
      <div>
        <InputCustom
          placeholder="Cerca la tua task..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {filteredTasks.length > 0 && (
          <ul className="absolute left-0 right-0 z-10 bg-white mt-1 max-h-60 overflow-y-auto">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                onClick={() => handleSelectTask(task)}
                className="cursor-pointer p-2 hover:bg-gray-200"
              >
                {task.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ScearchTask;
