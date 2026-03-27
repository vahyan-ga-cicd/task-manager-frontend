import {
  IAuthResponse,
  ILoginRequest,
  ISignupRequest,
} from "@/@types/interface/auth.interfaces";
import axios from "axios";
import { getAuthHeaders } from "@/config/axios";
import { UserData } from "@/context/AuthContext";

export async function createUser(body: ISignupRequest): Promise<IAuthResponse> {
  try {
    const res = await axios.post("/api/auth/register", body);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = 
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.response?.data?.message;
      throw new Error(serverMessage || "Registration failed");
    }
    throw new Error("Registration failed");
  }
}

export const loginUser = async (
  body: ILoginRequest,
): Promise<IAuthResponse> => {
  try {
    const res = await axios.post<IAuthResponse>("/api/auth/login", body);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Login error data:", error.response?.data || error.message);
      const serverMessage = 
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.response?.data?.message;
      throw new Error(serverMessage || "Login failed");
    }

    throw new Error("Login failed");
  }
};

export const getUser = async (): Promise<UserData> => {
  try {
    const token = localStorage.getItem("token");
    console.log("get user", token);
    const res = await axios.get("/api/auth/getcurrentuser", getAuthHeaders(token));

    return res.data;
  } catch (error: unknown) {
    console.log("context error", error);
    if (axios.isAxiosError(error)) {
      console.log("User fetch error data:", error.response?.data || error.message);
      const serverMessage = 
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message;
      throw new Error(serverMessage || "Something went wrong");
    }
    throw new Error("Something went wrong");
  }
};
