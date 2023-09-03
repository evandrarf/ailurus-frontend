import { getAdmin } from "@/components/fetcher/admin";
import { getUser, useUserResources } from "@/components/fetcher/user";
import { Score } from "@/types/scoreboard";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import React from "react";

interface LeaderboardProps {
  isAdmin?: boolean;
  className?: string;
}

export default function Leaderboard({ isAdmin, className }: LeaderboardProps) {
  const userResourcesQuery = useUserResources();
  const scoreboardQuery = useQuery({
    queryFn: () =>
      isAdmin
        ? getAdmin<Score[]>("admin/scoreboard/")
        : getUser<Score[], { is_freeze: boolean }>("scoreboard/"),
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

  return (
    <div className={className}>
      {/* @ts-ignore */}
      {"is_freeze" in scoreboardQuery.data &&
        scoreboardQuery.data.is_freeze && (
          <div className="my-4 py-2 px-4 bg-primary text-primary-content rounded-md">
            Leaderboard is frozen.
          </div>
        )}
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th className="w-full">Team</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scoreboardQuery.data?.data.map((team) => (
            <tr key={team.id}>
              <th>{team.rank}</th>
              <td>{team.name}</td>
              <td>{team.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
