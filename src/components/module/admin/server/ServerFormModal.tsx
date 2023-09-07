import { ChallengeServer } from "@/types/server";
import React, { ReactElement, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputRow } from "../common/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAdmin, patchAdmin } from "@/components/fetcher/admin";
import Modal from "../../common/Modal/Modal";

type ServerFormData = Omit<ChallengeServer, "id">;
interface ServerFormProps {
  mode: "new" | "update";
  server?: ServerFormData;
  serverId?: number;
  onSave?: () => void;
}

function ServerForm({ server, mode, serverId, onSave }: ServerFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ServerFormData>({
    defaultValues: server,
  });
  const updateOrCreateMutation = useMutation({
    mutationFn: (data: ServerFormData) =>
      mode == "new"
        ? postAdmin("admin/servers/", { json: data })
        : patchAdmin("admin/servers/" + serverId, { json: data }),
  });

  return (
    <FormProvider {...form}>
      <h4 className="font-bold text-xl">Server Edit</h4>
      <form
        onSubmit={form.handleSubmit((data) => {
          updateOrCreateMutation.mutate(data);
          onSave?.();
          queryClient.invalidateQueries(["servers"]);
        })}
      >
        <InputRow
          name="host"
          label="Server Host"
          errorMessage={form.formState.errors.host?.message ?? ""}
          control={form.control}
        />
        <InputRow
          name="sshport"
          label="Server Port"
          errorMessage={form.formState.errors.host?.message ?? ""}
          control={form.control}
        />
        <InputRow
          name="username"
          label="Server Username"
          errorMessage={form.formState.errors.host?.message ?? ""}
          control={form.control}
        />
        <div className="form-control">
          <label className="label">
            <span className="label-text">Auth Key</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            {...form.register("auth_key")}
          ></textarea>
        </div>

        <div className="flex flex-row justify-end pt-4">
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export default function ServerFormModal({
  server,
  serverId,
  btn,
  mode,
}: ServerFormProps & {
  btn: ReactElement;
}) {
  return (
    <Modal btn={btn} showClose>
      {({ ref }) => (
        <ServerForm
          server={server}
          mode={mode}
          serverId={serverId}
          onSave={() => ref.current?.close()}
        />
      )}
    </Modal>
  );
}
