import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import { RequireRole } from "@/hooks/admin";
import React from "react";

function AuditLogsPage() {
  return (
    <RequireRole roleRequired="admin">
      <AdminDashboard defaultTab="audit-logs" />
    </RequireRole>
  );
}

export default AuditLogsPage;
