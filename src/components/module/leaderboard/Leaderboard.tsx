import { getAdmin } from "@/components/fetcher/admin";
import { getUser, usePublicResources } from "@/components/fetcher/user";
import { ChallengePublic } from "@/types/challenge";
import { ChallengeScore, Score } from "@/types/scoreboard";
import {
  ArrowDown,
  ArrowUp,
  FlagCheckered,
  ShieldPlus,
  Skull,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";

interface LeaderboardProps {
  isAdmin?: boolean;
  className?: string;
}

export default function Leaderboard({ isAdmin, className }: LeaderboardProps) {
  const userResourcesQuery = usePublicResources();
  const scoreboardQuery = useQuery({
    queryKey: ["leaderboard", isAdmin ? "admin" : "user"],
    queryFn: () =>
      isAdmin
        ? getAdmin<Score[], { challenges: ChallengePublic[] }>(
            "admin/leaderboard/"
          )
        : getUser<
            Score[],
            { is_freeze: boolean; challenges: ChallengePublic[] }
          >("leaderboard/"),
  });

  if (userResourcesQuery.isLoading || scoreboardQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (userResourcesQuery.error || scoreboardQuery.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        An error has occured.
      </div>
    );
  }

  const capitalizeWords = (str: string) =>
    str.replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={className}>
      {"is_freeze" in (scoreboardQuery?.data ?? {}) &&
        // @ts-ignore
        scoreboardQuery.data.is_freeze && (
          <div className="my-4 py-2 px-4 bg-primary text-primary-content rounded-md">
            Leaderboard is frozen.
          </div>
        )}
      {scoreboardQuery?.data?.data.length === 0 ? (
        <>
          <div className="flex min-h-screen items-center justify-center">
            Leaderboard is empty.
          </div>
        </>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Team</th>
                {scoreboardQuery.data?.challenges?.map((chall) => (
                  <th key={chall.id} className="w-40">
                    {chall.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scoreboardQuery.data?.data?.map((team) => (
                <tr key={team.id}>
                  <th>{team.rank}</th>
                  <td>
                    <div className="flex flex-col gap-2">
                      <strong className="font-bold">{team.name}</strong>
                      <span title="Total Score">
                        {team.total_score.toFixed(2)}
                      </span>
                    </div>
                  </td>

                  {scoreboardQuery.data?.challenges?.map((chall) => {
                    const challScore: ChallengeScore | undefined =
                      team.challenges[chall.id.toString()];
                    const serviceState =
                      userResourcesQuery.datas.serviceStatus.data[
                        chall.id.toString()
                      ]?.[team.id.toString()]?.status ?? 1;
                    const serviceStateDetail =
                      userResourcesQuery.datas.serviceStatus.data[
                        chall.id.toString()
                      ]?.[team.id.toString()]?.detail;
                    return (
                      <td key={chall.id}>
                        <div className="flex flex-col font-mono text-base">
                          <span
                            className="flex flex-row items-center gap-2"
                            title="Attack Score"
                          >
                            <Skull /> {challScore.attack ?? "0%"}
                          </span>

                          <span
                            className="flex flex-row items-center gap-2"
                            title="Defend Score"
                          >
                            <ShieldPlus /> {challScore.defense ?? "100%"}
                          </span>

                          <div className="flex flex-row items-center gap-2">
                            <FlagCheckered />
                            <span title="Flag Captured">
                              {challScore.flag_captured ?? 0}
                            </span>{" "}
                            /{" "}
                            <span title="Flag Stolen">
                              {challScore.flag_stolen ?? 0}
                            </span>
                          </div>

                          <div
                            className={clsx(
                              "flex flex-row items-center gap-2",
                              serviceState === 1 ? "text-success" : "text-error"
                            )}
                          >
                            <span
                              title="State"
                              className="flex flex-row gap-1 items-center"
                            >
                              {serviceState === 0 ? (
                                <>
                                  <ArrowDown />
                                </>
                              ) : (
                                <>
                                  <ArrowUp />
                                </>
                              )}
                            </span>
                            <span title="SLA">{challScore.sla ?? "100%"}</span>
                          </div>

                          <div
                            className={clsx(
                              "flex flex-row items-center gap-2",
                              serviceState === 1 ? "text-success" : "text-error"
                            )}
                          >
                            <span
                              title="State"
                              className="flex flex-row gap-1 items-center"
                            >
                              {serviceState === 1 ? (
                                <>
                                  {serviceStateDetail &&
                                  typeof serviceStateDetail === "string"
                                    ? capitalizeWords(serviceStateDetail)
                                    : "Valid"}
                                </>
                              ) : (
                                <>
                                  {serviceStateDetail ? (
                                    typeof serviceStateDetail === "string" ? (
                                      capitalizeWords(serviceStateDetail)
                                    ) : (
                                      <div className="flex flex-col gap-2">
                                        {Object.entries(serviceStateDetail).map(
                                          ([key, value], idx) => (
                                            <p key={`${key}-${idx}`}>
                                              {key} : {value.check1}
                                            </p>
                                          )
                                        )}
                                      </div>
                                    )
                                  ) : (
                                    "Faulty"
                                  )}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
