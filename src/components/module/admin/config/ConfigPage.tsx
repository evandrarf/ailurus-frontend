import React, { useContext, useState } from "react";
import { AdminContext } from "../AdminContext";
import { useFieldArray, useForm } from "react-hook-form";
import { ConfigType } from "@/types/common";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAdmin, putAdmin } from "@/components/fetcher/admin";

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

function EditConfigList({
  configs,
  onSave,
}: ConfigProps & {
  onSave: (newConfig: ConfigType) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      config: Object.entries(configs),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "config",
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSave(Object.fromEntries(data.config)))}
    >
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <div className="flex flex-row gap-2">
              <a
                className="btn btn-error text-error-content"
                onClick={() => remove(index)}
              >
                X
              </a>
              <div className="form-control w-full">
                <input
                  className="input input-bordered"
                  {...register(`config.${index}.0`, {
                    required: "This field is required",
                  })}
                />
                {errors.config?.[index]?.[0]?.message && (
                  <label className="label">
                    <span className="label-text-alt">
                      {errors.config?.[index]?.[0]?.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-control">
              <input
                className="input input-bordered"
                {...register(`config.${index}.1`, {
                  required: "This field is required",
                })}
              />
              {errors.config?.[index]?.[1]?.message && (
                <label className="label">
                  <span className="label-text-alt">
                    {errors.config?.[index]?.[1]?.message}
                  </span>
                </label>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-row gap-2 justify-end py-4">
        <a className="btn btn-secondary" onClick={() => append([["", ""]])}>
          Add New Config
        </a>
        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}

export default function ConfigPage() {
  const queryClient = useQueryClient();
  const { contestConfig } = useContext(AdminContext);
  const [isEditing, setIsEditing] = useState(false);
  const mutateConfig = useMutation({
    mutationFn: (data: ConfigType) =>
      putAdmin<ConfigType>("admin/contest/config", {
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
        <EditConfigList
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
