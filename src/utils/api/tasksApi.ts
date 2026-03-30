import axios from "axios";
import { getAuthHeaders } from "@/config/axios";
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
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "/api/tasks/showtasks",
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

export const updateTaskStatus = async (
  user_id: string,
  task_id: string,
  status: "pending" | "ongoing" | "complete" | "on-hold",
  on_hold_reason?: string,
  is_verified?: boolean,
  comment?: string
) => {
  const token = localStorage.getItem("token");

  const res = await axios.put(
    `/api/tasks/updatetask/${task_id}?target_user_id=${user_id}`, // ✅ IMPORTANT
    {
      status,
      on_hold_reason,
      is_verified,
      comment_by_coordinator: comment // ✅ IMPORTANT
    },
    getAuthHeaders(token as string)
  );

  return res.data;
};

// export const deleteTask = async (task_id: string) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axios.delete(
//       `/api/tasks/deletetask/${task_id}`,
//       getAuthHeaders(token as string),
//     );

//     return res.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       console.log(error.response?.data || error.message);
//       throw new Error(error.response?.data?.message || "Delete task failed");
//     }

//     throw new Error("Unexpected error occurred");
//   }
// };

export const fetchTaskStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "/api/tasks/stats",
      getAuthHeaders(token as string),
    );
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
    const res = await axios.delete(
      `/api/admin/deletetask/${targetUserId}/${taskId}`,
      getAuthHeaders(token || ""),
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
