import { getUser } from "@/components/fetcher/user";
import { ServerMode, guardServerMode } from "@/types/common";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { ReactElement, useContext, useRef } from "react";
import { AdminContext } from "../AdminContext";
import { Team } from "@/types/team";

interface TeamDetailProps {
  teamId: number;
}

function TeamDetail({ teamId }: TeamDetailProps) {
  const { contestConfig } = useContext(AdminContext);
  const serverMode = contestConfig["SERVER_MODE"] as ServerMode;
  const { data, isLoading } = useQuery({
    queryKey: ["team", teamId],
    queryFn: () => getUser<Team<ServerMode>>("teams/" + teamId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <h4 className="font-bold text-xl pb-4">Team Detail</h4>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Team ID</span>
        </label>
        <input
          type="text"
          value={data?.data.id}
          className="input input-bordered"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Team Name</span>
        </label>
        <input
          type="text"
          value={data?.data.name}
          className="input input-bordered"
        />
      </div>

      {guardServerMode<Team<"private">>(data?.data, serverMode, "private") && (
        <>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Server ID</span>
            </label>
            <input
              type="text"
              value={data?.data.server.id}
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Server Host</span>
            </label>
            <input
              type="text"
              value={data?.data.server.host}
              className="input input-bordered"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function TeamDetailModal({
  teamId,
  btn,
}: TeamDetailProps & { btn: ReactElement }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <a onClick={() => ref.current?.showModal()}>{btn}</a>
      <dialog className="modal" ref={ref}>
        <div className="modal-box">
          <TeamDetail teamId={teamId} />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
