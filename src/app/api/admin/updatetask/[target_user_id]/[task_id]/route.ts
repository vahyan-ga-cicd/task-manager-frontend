import { axiosClient, getAuthHeaders } from "@/config/axios";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ target_user_id: string; task_id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const { target_user_id, task_id } = await params;
    const body = await request.json();

    const res = await axiosClient.put(
      `/admin/update-task/${target_user_id}/${task_id}`,
      body,
      getAuthHeaders(token || "")
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
        return NextResponse.json(
            { message: error.response?.data?.detail || error.response?.data?.message || "Admin update failed" },
            { status: error.response?.status || 500 }
        );
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
