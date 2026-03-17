import { IUser } from "@/@types/interface/admin.interfaces";
import axios from "axios";

export const getallusers = async ():Promise<IUser[]> => {
  try {
    const res = await axios.get("/api/admin/showallusers");
    return res.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch users");
  }
};
