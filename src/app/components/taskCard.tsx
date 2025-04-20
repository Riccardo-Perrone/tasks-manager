import React from "react";
import { Draggable } from "@hello-pangea/dnd";
//icons
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { Task } from "@/src/utils/types";

interface Props {
  task: Task;
  index: number;
  handleClick: (task: Task) => void;
}

function TaskCard({ task, index, handleClick }: Props) {
  return (
    <Draggable draggableId={task.id!} index={index}>
      {(provided) => (
        <div
          className="p-3 mb-2 rounded-lg shadow bg-white cursor-pointer relative group"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => handleClick(task)}
        >
          <div className="absolute top-2 right-2 text-gray-500 cursor-pointer rounded-3xl p-1 flex justify-center items-center hover:bg-blue-50 hover:text-gray-700 opacity-0 group-hover:opacity-100">
            <FaRegEdit />
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">{task.title}</span>
          </div>
          {task.time_estimated && (
            <div className="bg-blue-100 w-fit rounded-md px-2 flex flex-row items-center gap-1.5">
              {`${task.time_estimated}`}
              <AiOutlineClockCircle />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
