import { axiosClient } from "@/config/axios";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "stats") {
      const res = await axiosClient.get("/public/stats");
      return NextResponse.json(res.data);
    }

    const limit = searchParams.get("limit") || "10";
    const lastKey = searchParams.get("lastKey") || "";

    const res = await axiosClient.get("/public/tasks", {
      params: { limit, last_key: lastKey },
    });

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.detail || "Something went wrong" },
        { status: error.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { message: "Unexpected error occurred" },
      { status: 500 },
    );
  }
}
