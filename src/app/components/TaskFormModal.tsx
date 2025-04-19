"use client";

import { useEffect, useState } from "react";
import { Task, TaskStatus } from "../utils/types";
import { MdDelete } from "react-icons/md";
import { statusToLabel } from "../utils/statusToLabel";
import InputCustom from "./InputCustom";
import Editor, {
  BtnBold,
  BtnItalic,
  ContentEditableEvent,
  Toolbar,
  BtnBulletList,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
} from "react-simple-wysiwyg";

type TaskId = {
  id: string;
  status: TaskStatus;
  order_list: number;
};

interface Props {
  taskDetails?: Task;
  onSubmit: () => void;
  onClose: () => void;
  taskListId: string;
}

export const taskDefault: Task = {
  title: "",
  description: "",
  order_task: 0,
};

function TaskFormModal({ onClose, onSubmit, taskDetails, taskListId }: Props) {
  const [form, setForm] = useState<Task>(taskDefault);
  const [taskList, setTaskList] = useState<TaskId[]>([]);
  const [taskListIdState, setTaskListIdState] = useState<string>(taskListId);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  useEffect(() => {
    if (!!taskDetails) {
      if (!!taskDetails.id && taskDetails.id !== form.id) {
        getSingleTask(taskDetails.id);
      } else {
        setForm(taskDetails);
      }
    }
    getStatusData();
  }, []);

  const getStatusData = async () => {
    try {
      const res = await fetch("/api/tasks-list");
      if (!res.ok) throw new Error("Errore nella richiesta");

      const data: TaskId[] = await res.json();
      const sorted = data.sort((a, b) => a.order_list - b.order_list);
      setTaskList(sorted);
    } catch (err) {
      console.error("Errore durante il fetch:", err);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | ContentEditableEvent
  ) => {
    const { name, value } = e.target;
    if (!name || !value) return;
    setForm((prev) => ({
      ...prev,
      [name]: name === "time_estimated" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      ...form,
    };
    if (newTask.id !== undefined) {
      updateTask(newTask);
    } else {
      createNewTask(newTask);
    }
  };

  const getSingleTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Errore:", errorData.error);
      } else {
        const singleTask = await response.json();
        console.log("Task trovata con successo:", singleTask);
        setForm(singleTask);
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  const createNewTask = async (newTask: Task) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newTask, task_list_id: taskListIdState }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Errore:", errorData.error);
      } else {
        const createdTask = await response.json();
        console.log("Task creata con successo:", createdTask);
        onSubmit();
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };
  const updateTask = async (newTask: Task) => {
    try {
      const response = await fetch(`/api/tasks/${newTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newTask, task_list_id: taskListIdState }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Errore:", errorData.error);
      } else {
        const updatedTask = await response.json();
        console.log("Task modificata con successo:", updatedTask);
        onSubmit();
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Errore:", errorData.error);
      } else {
        const deletedTask = await response.json();
        console.log("Task eliminata con successo:", deletedTask);
        setConfirmDelete(false);
        onSubmit();
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
      <div className="bg-gray-200 p-6 rounded-lg w-full max-w-md shadow-lg relative m-2">
        <h2 className="text-2xl font-bold mb-4">
          {form.id ? "Modifica della task" : "Crea una nuova task"}
        </h2>

        {!!taskDetails?.id && (
          <>
            {confirmDelete ? (
              <div
                className="absolute top-5 right-5 "
                onClick={() => deleteTask(form.id!)}
                onPointerOut={() => {
                  setTimeout(() => {
                    setConfirmDelete(false);
                  }, 300);
                }}
              >
                <button
                  type="submit"
                  className="opacity-0 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer transition-opacity duration-300 hover:opacity-100"
                >
                  Elimina
                </button>
              </div>
            ) : (
              <div
                className="text-2xl absolute top-5 right-5 text-gray-500 cursor-pointer rounded-3xl p-1 flex justify-center items-center hover:bg-red-50 hover:text-red-700"
                onClick={() => setConfirmDelete(true)}
              >
                <MdDelete className="transform transition-transform duration-300 hover:scale-110" />
              </div>
            )}
          </>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputCustom
            label="Titolo *"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            maxLength={50}
          />

          <div>
            <Editor
              value={form.description || ""}
              onChange={handleChange}
              name="description"
              className="max-h-50 overflow-auto bg-white"
            >
              <Toolbar>
                <BtnBold />
                <BtnItalic />
                <BtnUnderline />
                <BtnStrikeThrough />
                <div className="rsw-separator"></div>
                <BtnNumberedList />
                <BtnBulletList />
              </Toolbar>
            </Editor>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Stato
            </label>
            <select
              name="status"
              value={taskListIdState}
              onChange={(e) => setTaskListIdState(e.target.value)}
              className="mt-1 w-full border bg-white border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            >
              {taskList.map((status) => (
                <option key={status.id} value={status.id}>
                  {statusToLabel(status.status)}
                </option>
              ))}
            </select>
          </div>

          <InputCustom
            label="Tempo stimato (ore)"
            name="time_estimated"
            type="number"
            value={form.time_estimated || undefined}
            onChange={handleChange}
            min={0}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-500 cursor-pointer"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskFormModal;
