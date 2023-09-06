import { postAdmin, getAdmin } from "@/components/fetcher/admin";
import {
  getUser,
  postUser,
  useUserResources,
  useUserServicesStatus,
} from "@/components/fetcher/user";
import { authTokenAtom } from "@/components/states";
import { parseJwt } from "@/components/utils";
import { Challenge } from "@/types/challenge";
import { ServerMode } from "@/types/common";
import { ServerState } from "@/types/service";
import { Team } from "@/types/team";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import React, { useMemo, useState } from "react";

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
  const { isFetching: statusFetching, data: status } = useUserServicesStatus();
  const state = status?.data[challId.toString()]?.[teamId.toString()];

  return (
    <div
      key={teamId}
      className="flex flex-row justify-between p-4 rounded-md bg-base-100 text-base-content items-center"
    >
      <div className="flex flex-col gap-2 justify-center">
        <strong>{teamName}</strong>
        <span>
          Status:{" "}
          {statusFetching ? "Fetching..." : state === 0 ? "Faulty" : "Valid"}
        </span>
      </div>
      <ul className="list-inside">
        {addresses.map((addr) => (
          <li key={addr}>{addr}</li>
        ))}
      </ul>
    </div>
  );
}

function ServiceRow({ chall, services }: ServiceRowProps) {
  const [authToken, _] = useAtom(authTokenAtom);
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
  const { data: unlockedData } = useQuery({
    queryKey: ["unlocked"],
    queryFn: () => getUser<number[]>("my/solves"),
  });
  const parsedJwt = useMemo(
    () => parseJwt<{ sub: { team: Team<"share"> } }>(authToken),
    [authToken]
  );
  const challUnlocked = useMemo(
    () => (unlockedData?.data ?? []).includes(chall?.id ?? -1),
    [chall]
  );

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
            value={flag}
            onChange={(e) => setFlag(e.currentTarget.value)}
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

        <strong className="font-bold text-lg">Services:</strong>
        {Object.entries(services ?? {})
          .filter((data) => data[0] == parsedJwt?.sub.team.id.toString())
          .map(([teamId, address]) => {
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

        {challUnlocked && (
          <>
            <strong className="font-bold text-lg">Other Team Services:</strong>
            {Object.entries(services ?? {})
              .filter((data) => data[0] != parsedJwt?.sub.team.id.toString())
              .map(([teamId, address]) => {
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
          </>
        )}
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
