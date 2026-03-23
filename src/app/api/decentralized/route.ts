import { axiosClient } from "@/config/axios";
import { NextResponse } from "next/server";

export async function GET(){
   try {
    const res=await axiosClient.get("/public/tasks")
    return NextResponse.json(res.data);

   } catch (error:any) {
    console.log(error);
    return NextResponse.json(
      { message: error.response?.data?.detail || "Something went wrong" },
      { status: error.response?.status || 500 }
    );
   }
}