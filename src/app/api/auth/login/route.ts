import { axiosClient } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // console.log(username, email, password);

    // validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Username, email and password are required" },
        { status: 400 },
      );
    }

    const payload = {
      email,
      password,
    };

    // external API
    const res = await axiosClient.post("/auth/login", payload);
    // localStorage.setItem("token", res.data.access_token.token)
    // console.log(res.data.access_token.token)

    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    // console.log(error?.response?.data || error?.message);

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
