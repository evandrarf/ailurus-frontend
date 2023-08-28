import { BaseResponse } from "@/types/common";
import ky from "ky-universal";
import { api } from "./base";

type RequestFnArguments = Parameters<typeof api>;

async function doApi<T>(
  url: RequestFnArguments[0],
  options: RequestFnArguments[1]
) {
  return await api(url, {
    ...options,
    headers: {
      "X-ADCE-SECRET": JSON.parse(localStorage.getItem("adminToken") ?? ""),
    },
  }).json<BaseResponse<T>>();
}

export const getAdmin = <T>(...args: RequestFnArguments) =>
  doApi<T>(args[0], {
    ...args[1],
    method: "GET",
  });

export const postAdmin = <T>(...args: RequestFnArguments) =>
  doApi<T>(args[0], {
    ...args[1],
    method: "POST",
  });

export const putAdmin = <T>(...args: RequestFnArguments) =>
  doApi<T>(args[0], {
    ...args[1],
    method: "PUT",
  });

export const deleteAdmin = <T>(...args: RequestFnArguments) =>
  doApi<T>(args[0], {
    ...args[1],
    method: "DELETE",
  });

export const patchAdmin = <T>(...args: RequestFnArguments) =>
  doApi<T>(args[0], {
    ...args[1],
    method: "PATCH",
  });
