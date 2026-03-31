export interface AuditLog {
  log_id: string;
  performed_by_id: string;
  performed_by_name: string;
  performed_by_email: string;
  performed_by_role: string;
  task_id: string;
  task_title: string;
  action: string;
  details: string;
  timestamp: string;
  task_owner_id?: string;
  task_assigned_by_id?: string;
  priority?: string;
  department?: string;
  comment?: string;
  payload?: string;
}
