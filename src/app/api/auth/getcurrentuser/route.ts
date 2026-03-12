import { axiosClient, getAuthHeaders } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    try {
        const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    const res = await axiosClient.get(
          "/auth/user",
          //   payload,
          getAuthHeaders(token as string),

        );
      return NextResponse.json(res.data);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
  
}