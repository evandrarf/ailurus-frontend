import { AdminContextProvider } from "@/components/module/admin/AdminContext";
import AdminLayout from "@/components/module/admin/AdminLayout";
import ServicePage from "@/components/module/admin/service/ServicePage";
import React, { ReactElement } from "react";

export default function Config() {
  return (
    <AdminLayout>
      <ServicePage />
    </AdminLayout>
  );
}

Config.getLayout = function getLayout(page: ReactElement) {
  return <AdminContextProvider>{page}</AdminContextProvider>;
};
