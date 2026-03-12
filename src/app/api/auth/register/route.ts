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

    // external API
    const res = await axiosClient.post("/auth/register", payload);

    return NextResponse.json(res.data, { status: 200 });
  } catch (error: unknown) {
    // console.log(error?.response?.data || error.message);

    return NextResponse.json(
      { message: error || "Internal Server Error" },
      { status: 500 },
    );
  }
}
