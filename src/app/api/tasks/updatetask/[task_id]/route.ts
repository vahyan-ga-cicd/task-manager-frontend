import { axiosClient, getAuthHeaders } from "@/config/axios";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ task_id: string }> }
): Promise<NextResponse> {
  try {
    const { task_id } = await context.params;

    const body = await req.json();
    const { status } = body;

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const res = await axiosClient.put(
      `/tasks/update-task/${task_id}`,
      { status },
      getAuthHeaders(token as string)
    );

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Update task failed");
    }

    throw new Error("Unexpected error occurred");
  }
}