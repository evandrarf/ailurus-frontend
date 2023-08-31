import { BaseResponse, ServerMode } from "@/types/common";
import { api } from "./base";
import { useQuery } from "@tanstack/react-query";
import { Team } from "@/types/team";
import { Challenge } from "@/types/challenge";
import { ServiceList } from "@/types/service";
import toast from "react-hot-toast";
import { HTTPError } from "ky-universal";

type RequestFnArguments = Parameters<typeof api>;

async function doApi<T>(
  url: RequestFnArguments[0],
  options: RequestFnArguments[1],
  notify: boolean = false
) {
  let toastId: string = "";
  if (notify) toastId = toast.loading("Running...");
  try {
    const response = await api(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("authToken") ?? "null"
        )}`,
      },
    }).json<BaseResponse<T>>();
    if (notify) toast.success(response.message ?? "Success", { id: toastId });
    return response;
  } catch (err) {
    let message = "Unknown error, failed. See developer tools.";
    if (err instanceof HTTPError) {
      const errorJson: BaseResponse<never> = await err.response.json();
      if (errorJson.message) message = errorJson.message;
    }

    if (notify) toast.error(message, { id: toastId });
    throw err;
  }
}

export const getUser = <T>(...args: RequestFnArguments) =>
  doApi<T>(args[0], {
    ...args[1],
    method: "GET",
  });

export const postUser = <T>(...args: RequestFnArguments) =>
  doApi<T>(
    args[0],
    {
      ...args[1],
      method: "POST",
    },
    true
  );

export const putUser = <T>(...args: RequestFnArguments) =>
  doApi<T>(
    args[0],
    {
      ...args[1],
      method: "PUT",
    },
    true
  );

export const useUserTeams = () =>
  useQuery({
    queryKey: ["teams"],
    queryFn: () => getUser<Team<ServerMode>[]>("teams/"),
  });

export const useUserChallenges = () =>
  useQuery({
    queryKey: ["user", "challenges"],
    queryFn: () => getUser<Challenge<ServerMode>[]>("challenges/"),
  });

export const useUserServices = () =>
  useQuery({
    queryKey: ["user", "services"],
    queryFn: () => getUser<ServiceList>("services/"),
  });

export const useUserResources = () => {
  const teams = useUserTeams();
  const challenges = useUserChallenges();
  const services = useUserServices();

  return {
    isLoading: teams.isLoading || challenges.isLoading || services.isLoading,
    error: teams.error || challenges.error || services.error,
    datas: {
      teams: teams.data!,
      challenges: challenges.data!,
      services: services.data!,
    },
  };
};
