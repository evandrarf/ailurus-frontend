import DashboardLayout from "@/components/module/dashboard/DashboardLayout";
import DocsPage from "@/components/module/dashboard/docs/DocsPage";
import React, { ReactElement } from "react";

export default function docsPage() {
  return <DocsPage />;
}

docsPage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
