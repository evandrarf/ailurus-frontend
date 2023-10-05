import { AdminContextProvider } from "@/components/module/admin/AdminContext";
import AdminLayout from "@/components/module/admin/AdminLayout";
import CheckerPage from "@/components/module/admin/checker/CheckerPage";
import React, { ReactElement } from "react";

export default function checker() {
  return (
    <AdminLayout>
      <CheckerPage />
    </AdminLayout>
  );
}

checker.getLayout = function getLayout(page: ReactElement) {
  return <AdminContextProvider>{page}</AdminContextProvider>;
};
