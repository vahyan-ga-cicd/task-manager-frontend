import axios from "axios";
import { ICreateTask } from "@/@types/interface/tasks.interfaces";
import { getAuthHeaders } from "@/config/axios";
// interface UpdateTaskBody {
//   status: "pending" | "ongoing" | "complete";
// }
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};
const token: string | null = getToken();
export const createTask = async (body: ICreateTask) => {
  try {
    const res = await axios.post(
      "/api/tasks/createtask",
      body,
      getAuthHeaders(token as string),
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Create task failed");
    }

    throw new Error("Unexpected error occurred");
  }
};

export const fetchTasks = async () => {
  try {
    const res = await axios.get(
      "/api/tasks/showtask",
      getAuthHeaders(token as string),
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Fetch tasks failed");
    }

    throw new Error("Unexpected error occurred");
  }
};

export const updateTaskStatus = async (task_id: string, status: "pending" | "ongoing" | "complete") => {
  try {
    const res = await axios.put(
      `/api/tasks/updatetask/${task_id}`,
      { status },
      getAuthHeaders(token as string),
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Update task failed");
    }

    throw new Error("Unexpected error occurred");
  }
};

export const deleteTask = async (task_id: string) => {
  try {
    const res = await axios.delete(
      `/api/tasks/deletetask/${task_id}`,
      getAuthHeaders(token as string),
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Delete task failed");
    }

    throw new Error("Unexpected error occurred");
  }
};
