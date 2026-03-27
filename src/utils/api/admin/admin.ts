
import { IUser } from "@/@types/interface/admin.interfaces";
import axios from "axios";
import { axiosClient } from "@/config/axios";
import { ITask } from "@/@types/interface/tasks.interfaces";

export interface ApiResponse<T = unknown> {
  message: string;
  data: T;
  success?: boolean;
}

export const getallusers = async (): Promise<IUser[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const res = await axiosClient.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch users");
  }
};

export const updateuser = async (user_id: string, payload: Partial<IUser>): Promise<ApiResponse<IUser>> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const res = await axiosClient.put(`/admin/editUser/${user_id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Update failed");
    }
    throw new Error("Update failed");
  }
};

  export const fetchadminmytasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axiosClient.get("/admin/my-tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch my tasks");
    }
  };

  export const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axiosClient.get("/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch admin stats");
    }
  };

export const fetchadminalltasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axiosClient.get("/admin/all-tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch all tasks");
    }
  };
  
  export const getuserslist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axiosClient.get("/admin/users-list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch users list");
    }
  };
  
  export const assigntask = async (payload: {
  title: string;
  description?: string;
  assigned_to?: string;
  deadline?: string;
  priority: string;
}): Promise<ApiResponse<ITask>> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const res = await axiosClient.post("/admin/assign-task", payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Task assignment failed");
    }
    throw new Error("Task assignment failed");
  }
};

  export const adminUpdateTask = async (
  target_user_id: string,
  task_id: string,
  payload: unknown
): Promise<ApiResponse<ITask>> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const res = await axiosClient.put(`/admin/update-task/${target_user_id}/${task_id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Task update failed");
    }
    throw new Error("Task update failed");
  }
};

export const createuser = async (payload: Partial<IUser>): Promise<ApiResponse<IUser>> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const res = await axiosClient.post(`/admin/createuser`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "User creation failed");
    }
    throw new Error("User creation failed");
  }
};