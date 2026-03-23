import { axiosClient, getAuthHeaders } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ target_user_id: string; task_id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const { target_user_id, task_id } = await params;

    const res = await axiosClient.delete(
      `/admin/delete-task/${target_user_id}/${task_id}`,
      getAuthHeaders(token || "")
    );

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    const { isAxiosError } = await import("axios");
    console.log(error);
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.detail || "Something went wrong" },
        { status: error.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
