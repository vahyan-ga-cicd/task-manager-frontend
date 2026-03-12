import {
  IAuthResponse,
  ILoginRequest,
  ISignupRequest,
} from "@/@types/interface/auth.interfaces";
import axios from "axios";

export async function createUser(body: ISignupRequest): Promise<IAuthResponse> {
  try {
    const res = await axios.post("/api/auth/register", body);

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Register API failed");
    }

    throw new Error("Unexpected error occurred");
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
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login API failed");
    }

    throw new Error("Unexpected error occurred");
  }
};
export const getUser = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`/api/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong");
  }
};
