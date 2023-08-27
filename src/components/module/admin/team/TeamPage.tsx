import { getUser } from "@/components/fetcher/user";
import { contestInfoAtom } from "@/components/states";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useContext } from "react";
import { AdminContext } from "../AdminContext";
import { ServerMode } from "@/types/common";
import { Team } from "@/types/team";
import { Plus } from "@phosphor-icons/react";
import { deleteAdmin } from "@/components/fetcher/admin";
import { TeamProps } from "./interface";
import TeamFormModal from "./TeamFormModal";
import TeamDetailModal from "./TeamDetailModal";

function TeamRow<TServerMode extends ServerMode>({
  team,
}: TeamProps<TServerMode>) {
  const queryClient = useQueryClient();
  const deleteTeam = useMutation({
    mutationFn: () => deleteAdmin("admin/teams/" + team.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["teams"]);
    },
  });
  return (
    <div
      className="p-4 rounded-md bg-neutral text-neutral-content flex flex-row justify-between"
      key={team.id}
    >
      {team.name}
      <div className="flex flex-row gap-2 items-center">
        <TeamDetailModal
          btn={<button className="btn btn-primary btn-sm">Detail</button>}
          teamId={team.id}
        />
        <TeamFormModal
          btn={<button className="btn btn-secondary btn-sm">Edit</button>}
          mode="update"
          team={{
            name: team.name,
          }}
          teamId={team.id}
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
  const { contestConfig } = useContext(AdminContext);
  const serverMode = contestConfig["SERVER_MODE"] as ServerMode;

  const { isLoading, data } = useQuery({
    queryKey: ["teams"],
    queryFn: () => getUser<Team<typeof serverMode>[]>("teams/"),
  });

  return (
    <div className="px-4">
      <div className="flex flex-row justify-between">
        <h2 className="pt-2 pb-4 text-2xl font-bold">Team</h2>
        <TeamFormModal
          btn={
            <button className="btn btn-primary">
              <Plus size={18} />
              Add Team
            </button>
          }
          mode="new"
          team={undefined}
          teamId={undefined}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : !!!data ? (
        <div className="flex items-center justify-center">No team to show</div>
      ) : (
        data.data.map((team) => <TeamRow team={team} key={team.id} />)
      )}
    </div>
  );
}
