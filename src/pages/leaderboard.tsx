import Leaderboard from "@/components/module/leaderboard/Leaderboard";
import React from "react";

export default function leaderboard() {
  return (
    <div className="flex flex-col min-h-screen p-4 container mx-auto gap-4">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <Leaderboard className="w-full" />
    </div>
  );
}
