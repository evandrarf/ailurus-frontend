import { AdminContextProvider } from "@/components/module/admin/AdminContext";
import AdminLayout from "@/components/module/admin/AdminLayout";
import TeamPage from "@/components/module/admin/team/TeamPage";
import React, { ReactElement } from "react";

export default function Team() {
  return (
    <AdminLayout>
      <TeamPage />
    </AdminLayout>
  );
}

Team.getLayout = function getLayout(page: ReactElement) {
  return <AdminContextProvider>{page}</AdminContextProvider>;
};
