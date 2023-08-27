import { BaseResponse } from "@/types/common";
import { api } from "./base";

type RequestFnArguments = Parameters<typeof api>;

async function doApi<T>(
  url: RequestFnArguments[0],
  options: RequestFnArguments[1]
) {
  return await api(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${JSON.parse(
        localStorage.getItem("authToken") ?? ""
      )}`,
    },
  }).json<BaseResponse<T>>();
}

export const getUser = <T>(...args: RequestFnArguments) =>
  doApi<T>(args[0], {
    ...args[1],
    method: "GET",
  });

export const postUser = <T>(...args: RequestFnArguments) =>
  doApi<T>(args[0], {
    ...args[1],
    method: "POST",
  });

export const putUser = <T>(...args: RequestFnArguments) =>
  doApi<T>(args[0], {
    ...args[1],
    method: "PUT",
  });
