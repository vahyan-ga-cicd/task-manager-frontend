// import { axiosClient } from "@/config/axios";
import { InvoiceaxiosClient } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 },
      );
    }
    const body = {
      email,
      password, 
    };
    const res=await InvoiceaxiosClient.post("/auth/login",body)
    return NextResponse.json(res.data, { status: 200 });  } catch (error) {
    return new Response(
      JSON.stringify({ message: "An error occurred during login" }),
      { status: 500 },
    );
  }
}