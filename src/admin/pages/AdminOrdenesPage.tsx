
import { useState } from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import AdminOrdenes from "./AdminOrdenes";

export default function AdminOrdenesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AdminLayout>
      <AdminOrdenes searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </AdminLayout>
  );
}
