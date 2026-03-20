import { axiosClient, getAuthHeaders, InvoiceaxiosClient } from "@/config/axios";
import { isAxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ invoice_no: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    if (!token || token === "null" || token === "undefined") {
      return NextResponse.json({ message: "No valid token provided" }, { status: 401 });
    }
const { invoice_no } = await context.params;
    // const { invoice_no } = await params;

    const res = await InvoiceaxiosClient.get(
      `/invoices/${invoice_no}/pdf`,
      {
        ...getAuthHeaders(token),
        responseType: "arraybuffer", // Important for PDF stream
      }
    );
    
    return new Response(res.data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice_${invoice_no}.pdf`,
      },
    });
  } catch (error: unknown) {
    console.error("Download invoice PDF error:", error);

    if (isAxiosError(error)) {
      let message = "Download failed";
      if (error.response?.data instanceof ArrayBuffer || error.response?.data instanceof Uint8Array || Buffer.isBuffer(error.response?.data)) {
        try {
          const decoder = new TextDecoder();
          const decodedData = JSON.parse(decoder.decode(error.response.data));
          message = decodedData.detail || decodedData.message || message;
        } catch (e) {
          console.error("Failed to parse binary error response:", e);
        }
      } else {
        message = error.response?.data?.detail || error.response?.data?.message || message;
      }

      return NextResponse.json(
        { message },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
