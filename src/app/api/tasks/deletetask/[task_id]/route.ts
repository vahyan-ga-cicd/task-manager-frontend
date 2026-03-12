import { axiosClient, getAuthHeaders } from "@/config/axios";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ task_id: string }> },
): Promise<NextResponse> {
  try {
    const { task_id } = await context.params;

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const res = await axiosClient.delete(
      `/tasks/delete-task/${task_id}`,
     getAuthHeaders(token as string)
    );

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Delete task failed");
    }

    throw new Error("Unexpected error occurred");
  }
}