// import { axiosClient } from "@/config/axios";
import { InvoiceaxiosClient } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, mobile_number } = await request.json();
    if (!username || !email || !password || !mobile_number) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }
    if (password && (password.length < 6 || password.length > 15)) {
      return NextResponse.json(
        { message: "Password must be between 6 and 15 characters" },
        { status: 400 },
      );
    }
    const body = {
      username,
      email,
      password,
      mobile_number,
    };
      const res = await InvoiceaxiosClient.post("/auth/signup", body);

    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    NextResponse.json({ message: "Signup failed", error }, { status: 500 });
  }
}
