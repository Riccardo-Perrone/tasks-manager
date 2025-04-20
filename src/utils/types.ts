export type TaskListType = {
  task_list_id: string;
  order_list: number;
  status: TaskStatus;
  tasks: Task[];
};

export enum TaskStatus {
  ToDo = "to-do",
  InProgress = "in-progress",
  Done = "done",
}

export type Task = {
  id?: string;
  order_task: number;
  title: string;
  time_estimated?: number;
  description?: string;
  task_list_id: string;
};
