import { AdminContextProvider } from "@/components/module/admin/AdminContext";
import AdminLayout from "@/components/module/admin/AdminLayout";
import SubmissionPage from "@/components/module/admin/submission/SubmissionPage";
import React, { ReactElement } from "react";

export default function submission() {
  return (
    <AdminLayout>
      <SubmissionPage />
    </AdminLayout>
  );
}

submission.getLayout = function getLayout(page: ReactElement) {
  return <AdminContextProvider>{page}</AdminContextProvider>;
};
