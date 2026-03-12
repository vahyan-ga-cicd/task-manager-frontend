import { axiosClient, getAuthHeaders } from "@/config/axios";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    // const token: string | null = request.nextUrl.searchParams.get("token");

    console.log(token);

    // validation
    if (!token) {
      return NextResponse.json({ message: "token not found" }, { status: 400 });
    }

    const res = await axiosClient.get(
      "/tasks/fetch-task",
      //   payload,
      getAuthHeaders(token),
    );
    // external API
    // const res = await axios.get(
    //   "https://6ft4bgs2e6.execute-api.ap-south-1.amazonaws.com/api/v1/auth/register",
    //   ,
    // );

    return NextResponse.json(res.data, { status: 200 });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Create task failed");
    }

    throw new Error("Unexpected error occurred");
  }
}
