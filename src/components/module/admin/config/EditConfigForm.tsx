import { ConfigType } from "@/types/common";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

interface EditConfigProps {
  configs: ConfigType;
  onSave: (newConfig: ConfigType) => void;
}

export function EditConfigForm({ configs, onSave }: EditConfigProps) {
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
