import { AdminContextProvider } from "@/components/module/admin/AdminContext";
import AdminLayout from "@/components/module/admin/AdminLayout";
import ConfigPage from "@/components/module/admin/config/ConfigPage";
import React, { ReactElement } from "react";

export default function Config() {
  return (
    <AdminLayout>
      <ConfigPage />
    </AdminLayout>
  );
}

Config.getLayout = function getLayout(page: ReactElement) {
  return <AdminContextProvider>{page}</AdminContextProvider>;
};
