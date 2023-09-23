import AttackMap from "@/components/module/attackmap/AttackMap";
import React from "react";

export default function attackmap() {
  return (
    <div className="flex flex-col min-h-screen p-4 container mx-auto gap-4">
      <h1 className="text-3xl font-bold">Attack Map</h1>
      <AttackMap className="w-full svgIcon" />
    </div>
  );
}
