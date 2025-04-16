import React from "react";
import { Tasks, TaskStatus } from "../utils/types";
import TaskCard from "./TaskCard";
import { Droppable, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

interface TaskListProps {
  status: TaskStatus;
  tasks: Tasks[];
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export default function TaskList({
  status,
  tasks,
  dragHandleProps,
}: TaskListProps) {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <Droppable
      droppableId={status}
      ignoreContainerClipping={true}
      isDropDisabled={false}
      isCombineEnabled={false}
      direction="vertical"
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`bg-gray-100 p-4 rounded shadow min-w-[250px] transition-colors ${
            snapshot.isDraggingOver ? "bg-blue-100" : ""
          }`}
        >
          <h3
            className="text-lg font-bold capitalize mb-2 cursor-move"
            {...dragHandleProps}
          >
            {status}
          </h3>
          <div>
            {filteredTasks.map((task, index) => (
              <TaskCard key={task.id} index={index} task={task} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}
