import DashboardLayout from "@/components/module/dashboard/DashboardLayout";
import ServiceManagerPage from "@/components/module/dashboard/service/ServiceManagerPage";
import React, { ReactElement } from "react";

export default function serviceManager() {
  return <ServiceManagerPage />;
}

serviceManager.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
