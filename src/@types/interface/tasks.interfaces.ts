import { TaskStatus } from "../constant/taskStatus.constant";

export interface ICreateTask {
  title: string;
  description: string;
}

export interface ITask {
  task_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
}
