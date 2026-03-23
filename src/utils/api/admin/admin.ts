
import { IUser } from "@/@types/interface/admin.interfaces";
import axios from "axios";
import { axiosClient } from "@/config/axios";

export const getallusers = async ():Promise<IUser[]> => {
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

export const updateuser=async(user_id: string, payload: any)=>{
  try {
    const token=localStorage.getItem("token")
      if (!token) {
      throw new Error("No token found");
    }
    const res=await axios.put(`/api/admin/editUser/${user_id}`,payload,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    return res.data;
  } catch (error:any) {
      const message =
      error?.response?.data?.message ;

    throw new Error(message);
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
  
  export const assigntask = async (payload: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const res = await axiosClient.post("/admin/assign-task", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Task assignment failed";
      throw new Error(message);
    }
  };

export const createuser=async(payload:any)=>{
  try {
    const token=localStorage.getItem("token")
      if (!token) {
      throw new Error("No token found");
    }
    const res=await axios.post(`/api/admin/createuser`,payload,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    return res.data;
  } catch (error:any) {
     const message =
      error?.response?.data?.message ;

    throw new Error(message);
  }
}