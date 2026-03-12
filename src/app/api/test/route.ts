import { axiosClient, getAuthHeaders } from "@/config/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    // const res = await axiosClient.get(
    //       "/auth/user",
    //       //   payload,
    //       getAuthHeaders(token as string),
    //     );
        console.log(token)
    // console.log("test api")
    // return NextResponse.json(res.data);
}