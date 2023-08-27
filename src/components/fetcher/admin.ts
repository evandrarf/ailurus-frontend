import { BaseResponse } from "@/types/common";
import ky from "ky-universal";

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BASE_URL,
});

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
