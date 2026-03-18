import { axiosClient } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    console.log(username, email, password);

    // validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email and password are required" },
        { status: 400 },
      );
    }

    const payload = {
      username,
      email,
      password,
    };
  if (password && (password.length < 6 || password.length > 15)) {
      return NextResponse.json(
        { message: "Password must be between 6 and 15 characters" },
        { status: 400 },
      );
    }
    // external API
    const res = await axiosClient.post("/auth/register", payload);

    return NextResponse.json(res.data, { status: 200 });
  }catch (error: any) {
  console.log("Full error:", error?.response?.data);

  return NextResponse.json(
    {
      message:
        error?.response?.data?.detail || // FastAPI error
        // error?.response?.data?.message || 
        // error?.message ||
        "Internal Server Error",
    },
    { status: error?.response?.status || 500 }
  );
}
}
