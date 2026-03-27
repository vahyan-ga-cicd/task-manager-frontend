import { IUser } from "@/@types/interface/admin.interfaces";
import axios from "axios";
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
    const res = await axios.get("/api/admin/showallusers", {
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
    const res = await axios.put(`/api/admin/editUser/${user_id}`, payload, {
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
      const res = await axios.get("/api/admin/mytasks", {
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
      const res = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch admin stats");
    }
  };



// export const fetchadminalltasks = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("No token found");
//       const res = await axios.get("/api/admin/alltasks", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return res.data;
//     } catch (error) {
//       console.error(error);
//       throw new Error("Failed to fetch all tasks");
//     }
//   };
  


export const getuserslist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axios.get("/api/admin/users-list", {
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
    const res = await axios.post("/api/admin/assigntask", payload, {
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
    const res = await axios.put(`/api/admin/updatetask/${target_user_id}/${task_id}`, payload, {
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
    const res = await axios.post(`/api/admin/createuser`, payload, {
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