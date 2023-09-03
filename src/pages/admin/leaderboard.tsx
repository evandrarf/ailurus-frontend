import { AdminContextProvider } from "@/components/module/admin/AdminContext";
import AdminLayout from "@/components/module/admin/AdminLayout";
import Leaderboard from "@/components/module/leaderboard/Leaderboard";
import React, { ReactElement } from "react";

export default function LeaderboardPage() {
  return (
    <AdminLayout>
      <Leaderboard isAdmin className="px-4" />
    </AdminLayout>
  );
}

LeaderboardPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminContextProvider>{page}</AdminContextProvider>;
};
