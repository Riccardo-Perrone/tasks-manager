import React from "react";
import { Tasks } from "../utils/types";
import { Draggable } from "@hello-pangea/dnd";

interface Props {
  task: Tasks;
  index: number;
}

function TaskCard({ task, index }: Props) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="p-3 mb-3 rounded shadow bg-white"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="font-semibold">{task.title}</div>
          <p className="text-sm">{task.description}</p>
        </div>
      )}
    </Draggable>
  );
}

export default TaskCard;
