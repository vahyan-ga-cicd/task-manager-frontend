export interface IUser {
  user_id: string;
  username: string;
  password?: string;
  original_password?: string;
  hashed_password?: string;
  email: string;
  role: string;
  department: string;
  activation_status: "active" | "inactive";
}