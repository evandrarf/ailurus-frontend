import AttackMapPage from "@/components/module/attackmap/AttackMapPage";
import React from "react";

export default function attackmap() {
  return (
    <div className="flex flex-col min-h-screen p-4 container mx-auto gap-4">
      <h1 className="text-3xl font-bold">Attack Map</h1>
      <AttackMapPage />
    </div>
  );
}
