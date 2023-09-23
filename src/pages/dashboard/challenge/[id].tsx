import DashboardLayout from "@/components/module/dashboard/DashboardLayout";
import ChallengePage from "@/components/module/dashboard/challenge/ChallengePage";
import React, { ReactElement } from "react";

export default function challenge() {
  return <ChallengePage />;
}

challenge.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
