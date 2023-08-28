import { BaseResponse } from "@/types/common";
import ky from "ky-universal";
import { api } from "./base";
import { toast } from "react-hot-toast";

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
        "X-ADCE-SECRET": JSON.parse(localStorage.getItem("adminToken") ?? ""),
      },
    }).json<BaseResponse<T>>();
    if (notify) toast.success(response.message ?? "Success", { id: toastId });
    return response;
  } catch (err) {
    if (notify) toast.error("Failed", { id: toastId });
    throw err;
  }
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
  doApi<T>(
    args[0],
    {
      ...args[1],
      method: "PUT",
    },
    true
  );

export const deleteAdmin = <T>(...args: RequestFnArguments) =>
  doApi<T>(
    args[0],
    {
      ...args[1],
      method: "DELETE",
    },
    true
  );

export const patchAdmin = <T>(...args: RequestFnArguments) =>
  doApi<T>(
    args[0],
    {
      ...args[1],
      method: "PATCH",
    },
    true
  );
