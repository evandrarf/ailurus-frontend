import { ChallengeServer } from "@/types/server";
import React, { ReactElement, useContext, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputRow } from "../common/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAdmin, patchAdmin } from "@/components/fetcher/admin";
import { ServerMode, guardServerMode } from "@/types/common";
import { AdminContext } from "../AdminContext";

type ChallengeFormData = {
  name: string;
  description: string;
  num_expose: number;
  visibility: string;
  server_id?: number;
};

interface ChallengeFormProps {
  mode: "new" | "update";
  chall?: ChallengeFormData;
  challId?: number;
  onSave?: () => void;
}

function ChallengeForm({ chall, mode, challId, onSave }: ChallengeFormProps) {
  const { getConfig } = useContext(AdminContext);
  const serverMode = getConfig<ServerMode>("SERVER_MODE");

  const queryClient = useQueryClient();
  const form = useForm<ChallengeFormData>({
    defaultValues: chall,
  });
  const updateOrCreateMutation = useMutation({
    mutationFn: (data: ChallengeFormData) => {
      const finalData = {
        ...data,
        visibility: data.visibility.split(",").map((val) => Number(val)),
      };
      return mode == "new"
        ? postAdmin("admin/challenges/", { json: finalData })
        : patchAdmin("admin/challenges/" + challId, { json: finalData });
    },
  });

  return (
    <FormProvider {...form}>
      <h4 className="font-bold text-xl">Challenge Edit</h4>
      <form
        onSubmit={form.handleSubmit((data) => {
          updateOrCreateMutation.mutate(data);
          onSave?.();
          queryClient.invalidateQueries(["challenges"]);
        })}
      >
        <InputRow
          name="name"
          label="Name"
          errorMessage={form.formState.errors.name?.message ?? ""}
          control={form.control}
        />
        <InputRow
          name="description"
          label="Description"
          errorMessage={form.formState.errors.description?.message ?? ""}
          control={form.control}
          textarea
        />
        <InputRow
          name="num_expose"
          label="Number Port"
          errorMessage={form.formState.errors.num_expose?.message ?? ""}
          type="number"
          control={form.control}
        />
        <InputRow
          name="visibility"
          label="Rounds Visible (divided by comma)"
          errorMessage={form.formState.errors.visibility?.message ?? ""}
          control={form.control}
        />
        {serverMode == "share" && (
          <InputRow
            name="server_id"
            label="Server ID"
            errorMessage={form.formState.errors.server_id?.message ?? ""}
            type="number"
            control={form.control}
          />
        )}

        <div className="flex flex-row justify-end pt-4">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default function ChallengeFormModal({
  chall,
  challId,
  btn,
  mode,
}: ChallengeFormProps & {
  btn: ReactElement;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <a onClick={() => ref.current?.showModal()}>{btn}</a>
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          <ChallengeForm
            chall={chall}
            mode={mode}
            challId={challId}
            onSave={() => ref.current?.close()}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
