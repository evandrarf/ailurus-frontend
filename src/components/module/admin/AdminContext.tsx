import { getAdmin } from "@/components/fetcher/admin";
import { adminTokenAtom, authTokenAtom } from "@/components/states";
import { ComponentWithChildren } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import { createContext, useEffect, useRef } from "react";

interface AdminContextData {
  contestConfig: Record<string, string>;
}
export const AdminContext = createContext<AdminContextData>({
  contestConfig: {},
});

export function AdminContextProvider({ children }: ComponentWithChildren) {
  const ref = useRef<HTMLInputElement>(null);
  const [authToken, setAuthToken] = useAtom(adminTokenAtom);
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["config"],
    queryFn: () => getAdmin<Record<string, string>>("admin/contest/config"),
  });

  useEffect(() => {
    refetch();
  }, [authToken, refetch]);

  if (isLoading && !(authToken === "" || error)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <AdminContext.Provider
      value={{
        contestConfig: data?.data ?? {},
      }}
    >
      {authToken === "" || error ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="bg-neutral p-4 rounded-md">
            <input className="input" type="password" ref={ref} />
            <button
              className="btn ml-4"
              onClick={() => setAuthToken(ref.current!.value)}
            >
              Auth
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </AdminContext.Provider>
  );
}
