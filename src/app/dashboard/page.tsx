"use client";
import React, { useEffect, useState } from "react";
import TaskList from "../components/taskList";
import { Tasks, TaskStatus } from "../utils/types";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const tasksMockToDo: Tasks[] = [
  {
    id: "task-1",
    title: "Titolo 1",
    status: TaskStatus.ToDo,
    timeEstimated: "01/01/1990",
    description: "Descrizione",
  },
  {
    id: "task-4",
    title: "Titolo 4",
    status: TaskStatus.ToDo,
    timeEstimated: "01/01/1990",
    description: "Descrizione",
  },
  {
    id: "task-5",
    title: "Titolo 5",
    status: TaskStatus.ToDo,
    timeEstimated: "01/01/1990",
    description: "Descrizione",
  },
];
const tasksMockProgress: Tasks[] = [
  {
    id: "task-2",
    title: "Titolo 2",
    status: TaskStatus.InProgress,
    timeEstimated: "01/01/1990",
    description: "Descrizione",
  },
];
const tasksMockDone: Tasks[] = [
  {
    id: "task-3",
    title: "Titolo 3",
    status: TaskStatus.Done,
    timeEstimated: "01/01/1990",
    description: "Descrizione",
  },
];

type TaskColumns = {
  [key: string]: Tasks[];
};

export default function DashboardClient() {
  const [columnOrder, setColumnOrder] = useState<TaskStatus[]>([
    TaskStatus.ToDo,
    TaskStatus.InProgress,
    TaskStatus.Done,
  ]);

  const [tasksByStatus, setTasksByStatus] = useState<TaskColumns>({
    [TaskStatus.ToDo]: tasksMockToDo,
    [TaskStatus.InProgress]: tasksMockProgress,
    [TaskStatus.Done]: tasksMockDone,
  });

  useEffect(() => {
    // Esegui la richiesta GET per ottenere i task
    fetch("http://localhost:8080/api/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Errore nella risposta");
        }
        return response.json(); // Analizza la risposta JSON
      })
      .then((data) => {
        console.log("Task ricevuti:", data);
        // Qui puoi fare qualcosa con i dati, ad esempio, renderizzarli in una lista
      })
      .catch((error) => {
        console.error("Errore durante la richiesta:", error);
      });
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "column") {
      const newColumnOrder = [...columnOrder];
      const [removed] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, removed);
      setColumnOrder(newColumnOrder);
      return;
    }

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const sourceTasks = [...tasksByStatus[sourceStatus]];
    const destTasks = [...tasksByStatus[destStatus]];

    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceStatus === destStatus) {
      sourceTasks.splice(destination.index, 0, movedTask);
      setTasksByStatus({
        ...tasksByStatus,
        [sourceStatus]: sourceTasks,
      });
    } else {
      const updatedTask = { ...movedTask, status: destStatus as TaskStatus };
      destTasks.splice(destination.index, 0, updatedTask);
      setTasksByStatus({
        ...tasksByStatus,
        [sourceStatus]: sourceTasks,
        [destStatus]: destTasks,
      });
    }
  };

  return (
    <div>
      <button>Nuova Task</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              className="flex flex-row"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columnOrder.map((status, index) => (
                <Draggable key={status} draggableId={status} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="min-w-[300px] m-2"
                    >
                      <TaskList
                        status={status}
                        tasks={tasksByStatus[status]}
                        dragHandleProps={provided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
