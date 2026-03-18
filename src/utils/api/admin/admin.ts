
import { IUser } from "@/@types/interface/admin.interfaces";
import axios from "axios";

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
}
