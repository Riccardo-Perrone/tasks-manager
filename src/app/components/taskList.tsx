import React, { useEffect, useState } from "react";
import { Task, TaskListType, TaskStatus } from "../utils/types";
import TaskCard from "./TaskCard";
import { Droppable, DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
//icons
import { FiPlus } from "react-icons/fi";
import TaskFormModal, { taskDefault } from "./TaskFormModal";
import { statusToLabel } from "../utils/statusToLabel";

interface Props {
  taskList: TaskListType;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  getData: () => void;
}

export default function TaskList({
  dragHandleProps,
  taskList,
  getData,
}: Props) {
  const [valueTask, setValueTask] = useState<Task>();

  useEffect(() => {
    console.log(valueTask);
  }, [valueTask]);

  return (
    <>
      {!!valueTask && (
        <TaskFormModal
          taskListId={taskList.task_list_id}
          onClose={() => {
            setValueTask(undefined);
          }}
          onSubmit={() => {
            getData();
            setValueTask(undefined);
          }}
          taskDetails={valueTask}
        />
      )}
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
                    setValueTask(task);
                  }}
                />
              ))}
              {provided.placeholder}
            </div>
            <button
              className="p-1 cursor-pointer flex flex-row items-center w-full rounded text-sm hover:bg-gray-50"
              onClick={() => {
                setValueTask({ ...taskDefault });
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
