"use client";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import api from "@/src/lib/axios";
import { Task, TaskListType } from "@/src/utils/types";
import { useToast } from "@/src/utils/ToastProvider";
import TaskList from "@/src/app/components/TaskList";
import ScearchTask from "@/src/app/components/ScearchTask";
import TaskFormModal from "@/src/app/components/TaskFormModal";
import { useParams } from "next/navigation";
import Modal from "@/src/app/components/Modal";
import InputCustom from "@/src/app/components/InputCustom";
//icons
import { FiPlus } from "react-icons/fi";

export default function DashboardClient() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [taskLists, setTaskLists] = useState<TaskListType[]>([]);
  const [valueTask, setValueTask] = useState<Task>();

  const [showModal, setShowModal] = useState(false);
  const [listName, setListName] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await api.get<TaskListType[]>(`/projects/${id}`);

      const sorted = res.data.sort((a, b) => a.order_list - b.order_list);
      setTaskLists(sorted);
    } catch (error) {
      console.log(error);
      showToast(`Errore caricamento dati. Riprovare piu tardi`, "error");
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (type === "column") {
      const newOrder = [...taskLists];
      const [moved] = newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, moved);
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

  // Dopo aver mosso una task aggiorno la posizione di tutte le task che hanno cambiato posizione come effetto collaterale
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

  const createList = async () => {
    try {
      await api.post<TaskListType>("/tasks-list", {
        status: listName.toLowerCase().replaceAll(" ", "-"),
        projects_id: id,
      });
      getData();
      setShowModal(false);
    } catch (error) {
      showToast("Errore nella creazione della lista delle task", "error");
    }
  };

  return (
    <>
      {showModal && (
        <Modal
          handleClose={() => setShowModal(false)}
          handleSubmit={createList}
          textConfirm="Crea"
          textCancel="Annulla"
          title="Crea una nuova lista"
        >
          <InputCustom
            label="Nome della lista"
            value={listName}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^[A-Za-z\s]*$/.test(value);
              if (isValid) setListName(value);
            }}
          />
        </Modal>
      )}

      <div className="flex flex-col flex-1">
        <ScearchTask
          taskList={taskLists.flatMap((e) => e.tasks)}
          handleClick={setValueTask}
        />
        {!!valueTask && (
          <TaskFormModal
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {(provided) => (
              <div
                className="flex flex-row overflow-auto flex-1"
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
                          taskForm={setValueTask}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <div>
                  <div
                    onClick={() => setShowModal(true)}
                    className="hover:bg-white cursor-pointer flex flex-row items-center font-bold min-w-[300px] m-2 p-2 rounded shadow w-[300px] transition-colors bg-gray-200"
                  >
                    <FiPlus className="mx-2" /> Crea una lista
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
}
