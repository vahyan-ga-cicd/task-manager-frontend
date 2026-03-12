import { axiosClient, getAuthHeaders } from "@/config/axios";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!title || !description) {
      return NextResponse.json(
        { message: "Title and description are required" },
        { status: 400 },
      );
    }

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 },
      );
    }

    const payload = {
      title,
      description,
    };

    // Forward the token without the Bearer prefix if it's there
    // const rawToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    const res = await axiosClient.post(
      "/tasks/create-task",
      payload,
      getAuthHeaders(token),
    );

    return NextResponse.json(res.data, { status: 200 });

    
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Create task failed");
    }

    throw new Error("Unexpected error occurred");
  }
}
