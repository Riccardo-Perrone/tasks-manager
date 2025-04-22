export type TaskListType = {
  task_list_id: string;
  order_list: number;
  status: string;
  tasks: Task[];
};

export type Task = {
  id?: string;
  order_task: number;
  title: string;
  time_estimated?: number;
  description?: string;
  task_list_id: string;
  comments: Comment[];
};

export type Comment = {
  username: string;
  created_at: string;
  message: string;
};

export type Projects = {
  name: string;
  id: string;
  created_at: string;
};
