import React, { useContext, useState } from "react";
import { AdminContext } from "../AdminContext";
import { ConfigType } from "@/types/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchAdmin } from "@/components/fetcher/admin";
import { EditConfigForm } from "./EditConfigForm";

interface ConfigProps {
  configs: ConfigType;
}

function ConfigList({ configs }: ConfigProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(configs).map(([key, val]) => (
        <React.Fragment key={key}>
          <strong>{key}:</strong>
          <pre>{val}</pre>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function ConfigPage() {
  const queryClient = useQueryClient();
  const { contestConfig } = useContext(AdminContext);
  const [isEditing, setIsEditing] = useState(false);
  const mutateConfig = useMutation({
    mutationFn: (data: ConfigType) =>
      patchAdmin<ConfigType>("admin/contest/config", {
        json: {
          configs: data,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["config"]);
    },
  });

  return (
    <div className="px-4">
      <div className="flex flex-row justify-between">
        <h2 className="pt-2 pb-4 text-2xl font-bold">Configuration</h2>
        {!isEditing && (
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <EditConfigForm
          configs={contestConfig}
          onSave={(newConfig) => {
            mutateConfig.mutate(newConfig);
            setIsEditing(false);
          }}
        />
      ) : (
        <ConfigList configs={contestConfig} />
      )}
    </div>
  );
}
