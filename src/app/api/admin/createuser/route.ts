import { axiosClient, getAuthHeaders } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const { username, email, password, role, department } = await request.json();
    const payload = {
      username,
      email,
      password,
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
    const res = await axiosClient.post(
      `/admin/createuser`,
      payload,
      getAuthHeaders(token as string),
    );

    return NextResponse.json({
      message:"User Created Succesfully"
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
