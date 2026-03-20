import { ILoginRequest, ISignupRequest } from "@/@types/interface/authinvoice.interface";
import { axiosClient } from "@/config/axios";
// import {
//   ILoginRequest,
//   ISignupRequest,
//   IUserData,
// } from "@/@types/interface/auth.interface";
import axios from "axios";
export async function createUser(data: ISignupRequest) {
  try {
    const response = await axios.post("/api/admin/Invoice/auth/signup", data);

    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function loginUser(data: ILoginRequest) {
  try {
    const response = await axios.post("/api/admin/Invoice/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}