import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import { RequireRole } from "@/hooks/admin";
import React from "react";

function page() {
  return (
    <RequireRole roleRequired="admin">
      <AdminDashboard />
    </RequireRole>
  );
}

export default page;
