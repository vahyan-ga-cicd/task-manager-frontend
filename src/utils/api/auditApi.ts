import {  getAuthHeaders } from "@/config/axios";
import axios from "axios";

export const fetchAdminAuditLogs = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "/api/auditlogs/admin",
      getAuthHeaders(token as string)
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "Failed to fetch admin audit logs");
    }
    throw new Error("Failed to fetch admin audit logs");
  }
};

export const fetchCoordinatorAuditLogs = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "/api/auditlogs/coordinator",
      getAuthHeaders(token as string)
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "Failed to fetch coordinator audit logs");
    }
    throw new Error("Failed to fetch coordinator audit logs");
  }
};

export const fetchUserAuditLogs = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "/api/auditlogs/users",
      getAuthHeaders(token as string)
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "Failed to fetch user audit logs");
    }
    throw new Error("Failed to fetch user audit logs");
  }
};
