export enum TaskStatus {
  ToDo = "to-do",
  InProgress = "in-progress",
  Done = "done",
}

export type Tasks = {
  id: string;
  title: string;
  status: TaskStatus;
  timeEstimated: number;
  description: string;
};
