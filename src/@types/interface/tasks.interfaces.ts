import { TaskStatus } from "../constant/taskStatus.constant";

export interface ICreateTask {
  title: string;
  description: string;
}

export interface ITask {
  task_id: string;
  user_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigned_to_name?: string;
  assigned_by?: string;
  deadline?: string;
  created_at: string;
}
