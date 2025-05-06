import React from "react";
import { Task, TaskListType } from "@/src/utils/types";
import TaskCard from "./TaskCard";
import { Droppable, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import { taskDefault } from "./TaskFormModal";
import { statusToLabel } from "@/src/utils/statusToLabel";
//icons
import { FiPlus } from "react-icons/fi";

interface Props {
  taskList: TaskListType;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  taskForm: (task: Task) => void;
}

export default function TaskList({
  dragHandleProps,
  taskList,
  taskForm,
}: Props) {
  return (
    <>
      <Droppable
        droppableId={taskList.status}
        ignoreContainerClipping={true}
        isDropDisabled={false}
        isCombineEnabled={false}
        direction="vertical"
      >
        {(provided, snapshot) => (
          // min-h-[150px]
          <div
            className={`p-2 rounded shadow w-[300px]  transition-colors ${
              snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-200"
            }`}
          >
            <h3
              className="px-2 text-lg font-bold mb-2 cursor-move"
              {...dragHandleProps}
            >
              {statusToLabel(taskList.status)}
            </h3>
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {taskList.tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  index={index}
                  task={task}
                  handleClick={(task) => {
                    taskForm(task);
                  }}
                />
              ))}
              {provided.placeholder}
            </div>
            <button
              className="p-1 cursor-pointer flex flex-row items-center w-full rounded text-sm hover:bg-gray-50"
              onClick={() => {
                taskForm({
                  ...taskDefault,
                  task_list_id: taskList.task_list_id,
                });
              }}
            >
              <FiPlus className="mx-2" />
              Aggiungi una scheda
            </button>
          </div>
        )}
      </Droppable>
    </>
  );
}
