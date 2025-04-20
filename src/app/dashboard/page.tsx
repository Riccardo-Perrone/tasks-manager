"use client";
import React, { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import { Task, TaskListType } from "../utils/types";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import api from "@/src/lib/axios";
import { useToast } from "../utils/ToastProvider";

export default function DashboardClient() {
  const [taskLists, setTaskLists] = useState<TaskListType[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await api.get<TaskListType[]>("/tasks");
      console.log(res);

      const sorted = res.data.sort((a, b) => a.order_list - b.order_list);
      setTaskLists(sorted);
    } catch (error) {
      console.log(error);
      showToast(`Errore caricamento dati. Riprovare piu tardi`, "error");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type, combine, draggableId } = result;

    if (!destination) return;

    if (type === "column") {
      const newOrder = [...taskLists];
      const [moved] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, moved);
      // TODO: chiamare db per aggiorare ordine
      setTaskLists(newOrder);
      newOrder.forEach((e, key) => {
        if (e.order_list !== key) updateOrderList(e.task_list_id, key);
      });
      return;
    }

    const sourceList = taskLists.find(
      (list) => list.status === source.droppableId
    );
    const destList = taskLists.find(
      (list) => list.status === destination.droppableId
    );

    if (!sourceList || !destList) return;

    const sourceTasks = [...sourceList.tasks];
    const destTasks = [...destList.tasks];

    const [movedTask]: Task[] = sourceTasks.splice(source.index, 1);

    if (sourceList.status === destList.status) {
      sourceTasks.splice(destination.index, 0, movedTask);
      updateTaskLists(sourceList.task_list_id, sourceTasks);
    } else {
      destTasks.splice(destination.index, 0, movedTask);
      updateTaskLists(sourceList.task_list_id, sourceTasks);
      updateTaskLists(destList.task_list_id, destTasks);
    }
  };

  const updateTaskLists = (task_list_id: string, updatedTasks: Task[]) => {
    updatedTasks.forEach((element, key) => {
      if (key !== element.order_task || element.task_list_id !== task_list_id) {
        const updatedTask: Task = {
          ...element,
          order_task: key,
          task_list_id,
        };
        moveTask(updatedTask);
        updatedTasks[key] = updatedTask;
      }
    });

    setTaskLists((prev) =>
      prev.map((list) =>
        list.task_list_id === task_list_id
          ? { ...list, tasks: updatedTasks }
          : list
      )
    );
  };

  const moveTask = async (newTask: Task) => {
    try {
      await api.put(`/tasks/move-task/${newTask.id}`, {
        task_list_id: newTask.task_list_id,
        order_task: newTask.order_task,
      });
    } catch (error) {
      console.error("Errore di rete:", error);
      getData();
      showToast(`Errore spostamento task. Riprovare`, "error");
    }
  };

  const updateOrderList = async (task_list_id: string, order: number) => {
    try {
      await api.put(`/tasks-list/change-order/${task_list_id}`, {
        order_list: order,
      });
    } catch (error) {
      getData();
      showToast(`Errore spostamento liste task. Riprovare`, "error");
    }
  };

  return (
    <div className="overflow-auto h-screen w-full">
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
              {taskLists.map((list, index) => (
                <Draggable
                  key={list.status}
                  draggableId={list.status}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="min-w-[300px] m-2"
                    >
                      <TaskList
                        taskList={list}
                        dragHandleProps={provided.dragHandleProps!}
                        getData={getData}
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
