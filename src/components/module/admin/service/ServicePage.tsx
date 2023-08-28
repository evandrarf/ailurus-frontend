import { getAdmin, postAdmin } from "@/components/fetcher/admin";
import { Challenge } from "@/types/challenge";
import { ServerMode } from "@/types/common";
import { ServiceList } from "@/types/service";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";

interface ServiceRowProps {
  chall: Challenge<ServerMode>;
  services: Record<string, string[]>;
}

function ServiceRow({ chall, services }: ServiceRowProps) {
  return (
    <details className="p-4 rounded-md bg-neutral">
      <summary className="font-bold">{chall.name}</summary>
      <div className="flex flex-col gap-2 pl-4">
        {Object.entries(services).map(([teamId, address]) => (
          <div
            key={teamId}
            className="flex flex-row justify-between p-4 rounded-md bg-base-100 text-base-content"
          >
            <div className="flex flex-col gap-2">
              <strong>{teamId}</strong>
              <ul className="list-inside">
                {address.map((addr) => (
                  <li key={addr}>{addr}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

export default function ServicePage() {
  const { isLoading: servicesLoading, data: servicesData } = useQuery({
    queryKey: ["services"],
    queryFn: () => getAdmin<ServiceList>("admin/services/"),
  });
  const { isLoading: challsLoading, data: challsData } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => getAdmin<Challenge<ServerMode>[]>("admin/challenges/"),
  });

  const provisionServices = useMutation({
    mutationFn: () =>
      postAdmin("admin/services/provision", {
        json: { challenges: "*", teams: "*" },
      }),
  });

  return (
    <div className="px-4">
      <div className="flex flex-row justify-between">
        <h2 className="py-2 text-2xl font-bold">Service</h2>
      </div>

      <div className="bg bg-neutral rounded-md p-4 my-2 flex flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <strong className="font-strong text-lg">Provision Services</strong>
          <p className="text-sm">
            Provision each team&apos;s challenge services to the respective
            server.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => provisionServices.mutate()}
        >
          Provision
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {servicesLoading || challsLoading ? (
          <div className="flex items-center justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : !!!servicesData || Object.keys(servicesData.data).length === 0 ? (
          <div className="flex items-center justify-center">
            No services to show
          </div>
        ) : !!!challsData ? (
          <div className="flex items-center justify-center">
            Failed to load challenges data
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {Object.entries(servicesData.data).map(([challId, services]) => (
              <ServiceRow
                key={challId}
                chall={
                  challsData.data.find((chall) => chall.id == Number(challId))!
                }
                services={services}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
