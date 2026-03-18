import { axiosClient } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
  try {
     const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const res = await axiosClient.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return NextResponse.json(res.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}