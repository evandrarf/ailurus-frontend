import { AdminContextProvider } from "@/components/module/admin/AdminContext";
import AdminLayout from "@/components/module/admin/AdminLayout";
import ChallengePage from "@/components/module/admin/challenge/ChallengePage";
import React, { ReactElement } from "react";

export default function Config() {
  return (
    <AdminLayout>
      <ChallengePage />
    </AdminLayout>
  );
}

Config.getLayout = function getLayout(page: ReactElement) {
  return <AdminContextProvider>{page}</AdminContextProvider>;
};
