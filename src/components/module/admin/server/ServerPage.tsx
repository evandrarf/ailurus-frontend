import { getUser } from "@/components/fetcher/user";
import { contestInfoAtom } from "@/components/states";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useContext } from "react";
import { AdminContext } from "../AdminContext";
import { ServerMode } from "@/types/common";
import { Team } from "@/types/team";
import { Plus } from "@phosphor-icons/react";
import { deleteAdmin, getAdmin } from "@/components/fetcher/admin";
import { ServerProps } from "./interface";
import { ChallengeServer } from "@/types/server";
import ServerDetailModal from "./ServerDetailModal";
import ServerFormModal from "./ServerFormModal";

function ServerRow({ server }: ServerProps) {
  const queryClient = useQueryClient();
  const deleteTeam = useMutation({
    mutationFn: () => deleteAdmin("admin/servers/" + server.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["servers"]);
    },
  });
  return (
    <div
      className="p-4 rounded-md bg-neutral text-neutral-content flex flex-row justify-between items-center"
      key={server.id}
    >
      <div className="flex flex-col gap-1">
        <strong className="font-bold">
          {server.host}:{server.sshport}
        </strong>
        <span className="text-sm">Username: {server.username}</span>
      </div>

      <div className="flex flex-row gap-2 items-center">
        <ServerDetailModal
          btn={<button className="btn btn-primary btn-sm">Detail</button>}
          server={server}
        />

        <ServerFormModal
          btn={<button className="btn btn-secondary btn-sm">Edit</button>}
          server={server}
          serverId={server.id}
          mode="update"
        />

        <button
          className="btn btn-error btn-sm"
          onClick={() => {
            deleteTeam.mutate();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const { isLoading, data } = useQuery({
    queryKey: ["servers"],
    queryFn: () => getAdmin<ChallengeServer[]>("admin/servers/"),
  });

  return (
    <div className="px-4">
      <div className="flex flex-row justify-between">
        <h2 className="pt-2 pb-4 text-2xl font-bold">Server</h2>
        <ServerFormModal
          btn={
            <button className="btn btn-primary">
              <Plus size={18} /> Add Server
            </button>
          }
          mode="new"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : !!!data ? (
        <div className="flex items-center justify-center">
          No server to show
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {data.data.map((server) => (
            <ServerRow server={server} key={server.id} />
          ))}
        </div>
      )}
    </div>
  );
}
