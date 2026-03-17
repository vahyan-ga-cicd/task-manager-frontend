import { axiosClient } from "@/config/axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await axiosClient.get("/admin/users");
    return NextResponse.json(res.data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}