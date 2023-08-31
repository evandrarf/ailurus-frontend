import { getAdmin } from "@/components/fetcher/admin";
import { ChallengeDetail } from "@/types/challenge";
import { ServerMode, guardServerMode } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { InputLabel } from "../common/detail";
import { AdminContext } from "../AdminContext";
import { ReactElement, useContext, useRef } from "react";

function ChallengeDetail({ challId }: { challId: number }) {
  const { getConfig } = useContext(AdminContext);
  const serverMode = getConfig<ServerMode>("SERVER_MODE");

  const { isLoading, data } = useQuery({
    queryKey: ["challenges", challId],
    queryFn: () =>
      getAdmin<ChallengeDetail<ServerMode>>("admin/challenges/" + challId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!!!data) {
    return (
      <div className="flex items-center justify-center">
        Failed to load data
      </div>
    );
  }

  const chall = data.data;
  return (
    <div className="flex flex-col">
      <h4 className="font-bold text-xl pb-4">Server Detail</h4>
      <InputLabel label="ID" value={chall.id.toString()} />
      <InputLabel label="Name" value={chall.name.toString()} />
      <InputLabel label="Description" value={chall.description} textarea />
      <InputLabel label="Number Port" value={chall.num_expose.toString()} />
      <InputLabel label="Visibility" value={chall.visibility.join(",")} />
      {guardServerMode<ChallengeDetail<"share">>(
        chall,
        serverMode,
        "share"
      ) && (
        <>
          <InputLabel label="Server ID" value={chall.server_id.toString()} />
          <InputLabel label="Server Host" value={chall.server_host} />
        </>
      )}

      <div className="flex flex-col gap-2 pt-4">
        <p>
          Config status:{" "}
          <strong className="font-bold">
            {chall.config_status ? "OK" : "Missing"}
          </strong>
        </p>
      </div>
    </div>
  );
}

export default function ChallengeDetailModal({
  challId,
  btn,
}: {
  challId: number;
  btn: ReactElement;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <a onClick={() => ref.current?.showModal()}>{btn}</a>
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          <ChallengeDetail challId={challId} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
