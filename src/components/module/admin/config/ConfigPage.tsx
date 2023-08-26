import React, { useContext } from "react";
import { AdminContext } from "../AdminContext";

export default function ConfigPage() {
  const { contestConfig } = useContext(AdminContext);
  console.log(contestConfig);

  return (
    <div>
      <h2 className="pt-2 pb-4 text-2xl font-bold">Configuration</h2>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(contestConfig).map(([key, val]) => (
          <>
            <strong>{key}:</strong>
            <pre>{val}</pre>
          </>
        ))}
      </div>
    </div>
  );
}
