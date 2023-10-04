import { Checker, CheckerResponse } from "@/types/checker";
import { getAdmin } from "@/components/fetcher/admin";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/module/common/Pagination/Pagination";

const checkerResultMap: { [index: number]: string } = {
  0: "Fail",
  1: "Ok",
};

interface CheckerRowProps {
  data: Checker;
}

function CheckerRow({ data }: CheckerRowProps) {
  return (
    <tr>
      <th>{data.id}</th>
      <td>{data.time_created}</td>
      <td>{data.challenge_name}</td>
      <td>{data.team_name}</td>
      <td>{checkerResultMap[data.result] ?? "undefined"}</td>
      <td><pre>{data.message}</pre></td>
    </tr>
  );
}

function CheckerPanel() {
  const searchParams = useSearchParams();
  const { isLoading, data } = useQuery({
    queryKey: ["submissions", searchParams.toString()],
    queryFn: () =>
      getAdmin<CheckerResponse>("admin/checker/", {
        searchParams: searchParams,
      }),
  });

  return (
    <div>
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div>
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Time</th>
                <th>Challenge</th>
                <th>Team</th>
                <th>Status</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.checkers.map((checker) => (
                <CheckerRow data={checker} key={"checker-" + checker.id} />
              ))}
            </tbody>
          </table>
          <Pagination
            activePage={data?.data.current_page ?? 1}
            prevPage={data?.data.prev_page}
            nextPage={data?.data.next_page}
          />
        </div>
      )}
    </div>
  );
}

export default function CheckerPage() {
  return (
    <div className="px-4 justify-center w-full">
      <div className="flex flex-row justify-between">
        <h2 className="py-2 text-2xl font-bold">Checker</h2>
      </div>
      <CheckerPanel />
    </div>
  );
}
