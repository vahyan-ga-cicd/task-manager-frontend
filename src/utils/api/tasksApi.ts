import axios from "axios";
import { axiosClient, getAuthHeaders } from "@/config/axios";
import { ICreateTask } from "@/@types/interface/tasks.interfaces";
// interface UpdateTaskBody {
//   status: "pending" | "ongoing" | "complete";
// }
// const getToken = () => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("token");
//   }
//   return null;
// };
// const token: string | null = getToken();
export const createTask = async (body: ICreateTask) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axiosClient.post(
      "/tasks/create-task",
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
      const token = localStorage.getItem("token");

    const res = await axiosClient.get(
      "/tasks/fetch-task",
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
    const token = localStorage.getItem("token");
    const res = await axiosClient.put(
      `/tasks/update-task/${task_id}`,
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
    const token = localStorage.getItem("token");
    const res = await axiosClient.delete(
      `/tasks/delete-task/${task_id}`,
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
export const fetchTaskStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosClient.get("/tasks/stats", getAuthHeaders(token as string));
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Fetch stats failed");
    }
    throw new Error("Unexpected error occurred");
  }
};
export const adminDeleteTask = async (targetUserId: string, taskId: string) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosClient.delete(
      `/admin/delete-task/${targetUserId}/${taskId}`,
      getAuthHeaders(token || "")
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
