import {
  IAuthResponse,
  ILoginRequest,
  ISignupRequest,
} from "@/@types/interface/auth.interfaces";
import axios from "axios";
import { axiosClient, getAuthHeaders } from "@/config/axios";
import { UserData } from "@/context/AuthContext";

export  async function createUser(body: ISignupRequest): Promise<IAuthResponse> {
  try {
    const res = await axiosClient.post("/auth/register", body);

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw new Error("Registration failed");
  }
}

export const loginUser = async (
  body: ILoginRequest,
): Promise<IAuthResponse> => {
  try {
    const res = await axiosClient.post<IAuthResponse>("/auth/login", body);

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login API failed");
    }

    throw new Error("Login API failed");
  }
};

export const getUser = async (): Promise<UserData> => {
  try {
    const token = localStorage.getItem("token");
    console.log("get user",token)
    const res = await axiosClient.get(`/auth/user`, getAuthHeaders(token));

    return res.data;
  } catch (error: unknown) {
    console.log("context error",error)
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong");
  }
};
