import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ServerMode } from "@/types/common";
import { AdminContext } from "../AdminContext";
import { Path } from "react-hook-form";
import clsx from "clsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAdmin, patchAdmin } from "@/components/fetcher/admin";
import { InputRow } from "../common/form";

type TeamInput = {
  name: string;
  email: string;
  password: string;
  server_id?: number;
  server?: {
    host: string;
    sshport: number;
    username: string;
    auth_key: string;
  };
};

type TeamFormProps =
  | {
      mode: "new";
      teamId: undefined;
      team: undefined;
      onSave?: () => any;
    }
  | {
      mode: "update";
      teamId: number;
      team: Partial<TeamInput> | undefined;
      onSave?: () => any;
    };

function TeamForm({ team, mode, teamId, onSave }: TeamFormProps) {
  const queryClient = useQueryClient();
  const { contestConfig } = useContext(AdminContext);
  const serverMode = contestConfig["SERVER_MODE"] as ServerMode;
  const methods = useForm<TeamInput>({
    defaultValues: team,
  });
  const [additionMethod, setAdditionMethod] = useState<"id" | "new">("id");
  const updateOrCreateMutation = useMutation({
    mutationFn: (data: TeamInput) =>
      mode == "new"
        ? postAdmin("admin/teams/", { json: data })
        : patchAdmin("admin/teams/" + teamId, { json: data }),
  });

  useEffect(() => {
    if (additionMethod == "new") {
      methods.setValue("server_id", undefined);
    } else {
      methods.setValue("server", undefined);
    }
  }, [additionMethod]);

  return (
    <FormProvider {...methods}>
      <h4 className="font-bold text-xl">New Team</h4>
      <form
        onSubmit={methods.handleSubmit((data) => {
          updateOrCreateMutation.mutate(data);
          queryClient.invalidateQueries(["teams"]);
          methods.reset();
          onSave?.();
        })}
      >
        <InputRow
          name="name"
          label="Team Name"
          errorMessage={methods.formState.errors.name?.message ?? ""}
          control={methods.control}
        />
        <InputRow
          name="email"
          label="Email"
          errorMessage={methods.formState.errors.email?.message ?? ""}
          control={methods.control}
        />
        <InputRow
          name="password"
          label="Password"
          errorMessage={methods.formState.errors.password?.message ?? ""}
          type="password"
          control={methods.control}
        />
        {serverMode == "private" && (
          <>
            {mode == "new" && (
              <div className="flex flex-row gap-2 pt-4 items-center">
                <span>Server add mode: </span>
                <button
                  type="button"
                  onClick={() => setAdditionMethod("id")}
                  className={clsx(
                    "btn btn-sm",
                    additionMethod == "id" && "btn-primary"
                  )}
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => setAdditionMethod("new")}
                  className={clsx(
                    "btn btn-sm",
                    additionMethod == "new" && "btn-primary"
                  )}
                >
                  Name
                </button>
              </div>
            )}
            {additionMethod == "id" ? (
              <InputRow
                name="server_id"
                label="Server ID"
                errorMessage={
                  methods.formState.errors?.server_id?.message ?? ""
                }
                type="text"
                control={methods.control}
              />
            ) : (
              <>
                <InputRow
                  name="server.host"
                  label="Server Host"
                  errorMessage={
                    methods.formState.errors.server?.host?.message ?? ""
                  }
                  type="text"
                  control={methods.control}
                />
                <InputRow
                  name="server.sshport"
                  label="Server SSH Port"
                  errorMessage={
                    methods.formState.errors.server?.sshport?.message ?? ""
                  }
                  type="number"
                  control={methods.control}
                />
                <InputRow
                  name="server.username"
                  label="Server Username"
                  errorMessage={
                    methods.formState.errors.server?.username?.message ?? ""
                  }
                  type="text"
                  control={methods.control}
                />
                <InputRow
                  name="server.auth_key"
                  label="Server Auth Key"
                  errorMessage={
                    methods.formState.errors.server?.auth_key?.message ?? ""
                  }
                  type="text"
                  control={methods.control}
                  textarea
                />
              </>
            )}
          </>
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

export default function TeamFormModal({
  team,
  btn,
  mode,
  teamId,
}: TeamFormProps & {
  btn: ReactElement;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <a onClick={() => ref.current?.showModal()}>{btn}</a>
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          {/* @ts-ignore */}
          <TeamForm
            team={team}
            mode={mode}
            teamId={teamId}
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
