import { AdminContextProvider } from "@/components/module/admin/AdminContext";
import AdminLayout from "@/components/module/admin/AdminLayout";
import ServerPage from "@/components/module/admin/server/ServerPage";
import React, { ReactElement } from "react";

export default function Server() {
  return (
    <AdminLayout>
      <ServerPage />
    </AdminLayout>
  );
}

Server.getLayout = function getLayout(page: ReactElement) {
  return <AdminContextProvider>{page}</AdminContextProvider>;
};
