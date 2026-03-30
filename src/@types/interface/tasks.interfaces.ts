import { Priority } from "../constant/priority.constant";
import { TaskStatus } from "../constant/taskStatus.constant";

export interface ICreateTask {
  title: string;
  description: string;
  priority: Priority;
  assigned_to?: string;
  deadline?: string;
}

export interface ITask {
  task_id: string;
  user_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigned_to_name?: string;
  assigned_to_email?: string;
  assigned_by?: string;
  assigned_by_id?: string;
  assigned_by_email?: string;
  deadline?: string;
  created_at: string;
  on_hold_reason?: string;
  completed_at?: string;
  verified_by_coordinator?: boolean;
  coordinator_comment?: string;
}
