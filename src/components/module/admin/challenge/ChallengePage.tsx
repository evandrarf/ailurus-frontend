import React, { useContext } from "react";
import { AdminContext } from "../AdminContext";
import { ServerMode } from "@/types/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "@/components/fetcher/user";
import { Challenge } from "@/types/challenge";
import { deleteAdmin, getAdmin, postAdmin } from "@/components/fetcher/admin";
import ChallengeFormModal from "./ChallengeFormModal";
import { Plus } from "@phosphor-icons/react";
import ChallengeDetailModal from "./ChallengeDetailModal";

function Challenge({ challenge }: { challenge: Challenge<ServerMode> }) {
  const queryClient = useQueryClient();
  const deleteTeam = useMutation({
    mutationFn: () => deleteAdmin("admin/challenges/" + challenge.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["challenges"]);
    },
  });

  return (
    <div className="flex flex-row justify-between p-4 bg-neutral text-neutral-content rounded-md">
      <strong className="font-bold">{challenge.name}</strong>

      <div className="flex flex-row gap-2">
        <ChallengeDetailModal
          challId={challenge.id}
          btn={<button className="btn btn-primary btn-sm">Detail</button>}
        />

        <ChallengeFormModal
          mode="update"
          chall={{
            ...challenge,
            visibility: "",
          }}
          challId={challenge.id}
          btn={<button className="btn btn-secondary btn-sm">Edit</button>}
        />

        <button
          className="btn btn-error btn-sm"
          onClick={() => deleteTeam.mutate()}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function ChallengePage() {
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => getAdmin<Challenge<ServerMode>[]>("admin/challenges/"),
  });

  const populateChalls = useMutation({
    mutationFn: () =>
      postAdmin("admin/challenges/populate", { json: { confirm: true } }),
    onSuccess: () => {
      queryClient.invalidateQueries(["challenges"]);
    },
  });

  return (
    <div className="px-4 flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h2 className="pt-2 pb-4 text-2xl font-bold">Challenges</h2>
        <ChallengeFormModal
          btn={
            <button className="btn btn-primary">
              <Plus size={18} /> Add Challenge
            </button>
          }
          mode="new"
        />
      </div>

      <div className="bg bg-neutral rounded-md p-4 flex flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <strong className="font-strong text-lg">Populate Challenges</strong>
          <p className="text-sm">
            Populate challenge data from the local path to the database. This
            will overwrite all data inside the database. Challenge folder
            structure must follow section Challenge Folder Structure.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => populateChalls.mutate()}
        >
          Populate
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : !!!data ? (
        <div className="flex items-center justify-center">
          No challenges to show
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {data?.data.map((chall) => (
            <Challenge challenge={chall} key={chall.id} />
          ))}
        </div>
      )}
    </div>
  );
}
