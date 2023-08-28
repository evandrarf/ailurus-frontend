import React, { useContext } from "react";
import { AdminContext } from "../AdminContext";
import { ServerMode } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/components/fetcher/user";
import { Challenge } from "@/types/challenge";
import { getAdmin } from "@/components/fetcher/admin";

function Challenge({ challenge }: { challenge: Challenge<ServerMode> }) {
  return (
    <div className="flex flex-row justify-between">
      <strong className="font-bold">{challenge.name}</strong>
    </div>
  );
}

export default function ChallengePage() {
  const { getConfig } = useContext(AdminContext);
  const serverMode = getConfig<ServerMode>("SERVER_MODE");

  const { isLoading, data } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => getAdmin<Challenge<ServerMode>>("admin/challenges/"),
  });

  return (
    <div className="px-4 flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h2 className="pt-2 pb-4 text-2xl font-bold">Challenges</h2>
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
        <button className="btn btn-primary">Populate</button>
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
        <div className="flex flex-col gap-4"></div>
      )}
    </div>
  );
}
