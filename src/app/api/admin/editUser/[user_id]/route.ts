import { axiosClient, getAuthHeaders } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ user_id: string }> },
) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { user_id } = await context.params;
    const { username, email, password, activation_status, role, department } =
      await request.json();
    const payload = {
      username,
      email,
      password,
      activation_status,
      role,
      department,
    };
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (password && (password.length < 6 || password.length > 15)) {
      return NextResponse.json(
        { message: "Password must be between 6 and 15 characters" },
        { status: 400 },
      );
    }
    console.log(payload);
    const res = await axiosClient.put(
      `/admin/editUser/${user_id}`,
      payload,
      getAuthHeaders(token as string),
    );

    return NextResponse.json(res.data );
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
