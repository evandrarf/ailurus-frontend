import { postAdmin, getAdmin } from "@/components/fetcher/admin";
import { getUser, postUser, useUserResources } from "@/components/fetcher/user";
import { Challenge } from "@/types/challenge";
import { ServerMode } from "@/types/common";
import { Team } from "@/types/team";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

interface ServiceRowProps {
  chall: Challenge<ServerMode> | undefined;
  services: Record<string, string[]> | undefined;
}

interface TeamServiceRowProps {
  teamId: number;
  challId: number;
  teamName: string;
  addresses: string[];
}

function TeamServiceRow({
  teamName,
  addresses,
  teamId,
  challId,
}: TeamServiceRowProps) {
  const { isFetching: statusFetching, data: status } = useQuery({
    queryFn: () =>
      getAdmin<number>(`admin/services/${challId}/teams/${teamId}/status`),
  });

  return (
    <div
      key={teamId}
      className="flex flex-row justify-between p-4 rounded-md bg-base-100 text-base-content items-center"
    >
      <strong>{teamName}</strong>
      <ul className="list-inside">
        {addresses.map((addr) => (
          <li key={addr}>{addr}</li>
        ))}
      </ul>
    </div>
  );
}

function ServiceRow({ chall, services }: ServiceRowProps) {
  const { isLoading, error, datas } = useUserResources();
  const { isLoading: detailLoading, data } = useQuery({
    queryKey: ["challenges", chall?.id],
    queryFn: () => getUser<Challenge<ServerMode>>("challenges/" + chall?.id),
  });
  const [flag, setFlag] = useState("");
  const submitFlag = useMutation({
    mutationFn: (flag: string) =>
      postUser<never>("submit", {
        json: {
          flag,
          challenge_id: chall?.id,
        },
      }),
  });

  if (isLoading || detailLoading) {
    return (
      <div className="flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const teamsData = datas.teams;
  if (!!!teamsData || error) {
    return (
      <div className="flex items-center justify-center">
        An error occured while trying to load team data.
      </div>
    );
  }

  return (
    <details className="p-4 rounded-md bg-neutral">
      <summary className="font-bold">
        {chall?.name ?? "ChallengeNotFound"}
      </summary>
      <div className="flex flex-col gap-2 pl-4 pt-4">
        <strong className="font-bold text-lg">Description:</strong>
        <p className="whitespace-pre-line">{data?.data.description}</p>

        <div className="flex flex-row gap-2">
          <input
            className="w-full input input-bordered"
            placeholder="Flag"
            onClick={(e) => setFlag(e.currentTarget.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              submitFlag.mutate(flag);
              setFlag("");
            }}
          >
            Submit
          </button>
        </div>

        <strong className="font-bold text-lg">Other Services:</strong>
        {Object.entries(services ?? {}).map(([teamId, address]) => {
          const team = teamsData.data.find(
            (team) => team.id === Number(teamId)
          );
          return (
            <TeamServiceRow
              addresses={address}
              challId={chall?.id ?? 0}
              teamId={team?.id ?? 0}
              teamName={team?.name ?? "TeamNotFound"}
              key={`${chall?.id}-${team?.id}`}
            />
          );
        })}
      </div>
    </details>
  );
}

export default function MainPage() {
  const { isLoading, error, datas } = useUserResources();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        An error has occured.
      </div>
    );
  }

  if (datas.challenges.data.length == 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        No challenges available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4">
      {datas.challenges.data.map((chall) => (
        <ServiceRow
          chall={chall}
          services={datas.services.data[chall.id.toString()]}
          key={"chall-" + chall.id}
        />
      ))}
    </div>
  );
}
