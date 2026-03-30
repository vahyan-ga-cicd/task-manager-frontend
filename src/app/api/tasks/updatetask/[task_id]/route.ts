import { axiosClient, getAuthHeaders } from "@/config/axios";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ task_id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    const { task_id } = await params;
    const body = await request.json();

    // ✅ GET QUERY PARAM
    const target_user_id = request.nextUrl.searchParams.get("target_user_id");

    if (!target_user_id) {
      return NextResponse.json(
        { message: "target_user_id is required" },
        { status: 400 }
      );
    }

    const res = await axiosClient.put(
      `/tasks/update-task/${task_id}?target_user_id=${target_user_id}`,
      body,
      getAuthHeaders(token || "")
    );

    return NextResponse.json(res.data);

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          message:
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Update failed",
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}