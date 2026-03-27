export interface ITaskResponse {
  task_id: string;
  user_id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  created_at?: string;
  deadline?: string;
  assigned_by?: string;
  assigned_to_dept?: string;
  assigned_by_dept?: string;
  assigned_by_role?: string;
  completed_at?: string;
  assigned_by_email?: string;
  assigned_to_email?: string;
  assigned_to_name?: string;
  on_hold_reason?: string;
}