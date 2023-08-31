import DashboardLayout from "@/components/module/dashboard/DashboardLayout";
import MainPage from "@/components/module/dashboard/main/MainPage";
import React, { ReactElement } from "react";

export default function index() {
  return <MainPage />;
}

index.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
