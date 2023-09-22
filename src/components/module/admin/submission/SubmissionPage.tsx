import { Submission, SubmissionResponse } from "@/types/submission";
import { getAdmin } from "@/components/fetcher/admin";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import Link from "next/link";

interface PaginationProps {
  activePage: number;
  prevPage: number | undefined;
  nextPage: number | undefined;
}

interface SubmissionRowProps {
  data: Submission;
}

function SubmissionRow({data}: SubmissionRowProps) {
  return (
    <tr>
      <th>{data.id}</th>
      <td>{data.time_created}</td>
      <td>{data.challenge_name}</td>
      <td>{data.team_name}</td>
      <td>{data.value}</td>
      <td>{data.verdict ? "Valid":"Invalid"}</td>
    </tr>
  )
}

function SubmissionPanel() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const searchParams = useSearchParams();
  const { isLoading, data } = useQuery({
    queryKey: ["submissions"],
    queryFn: () => {
      return getAdmin<SubmissionResponse>("admin/submission/", {searchParams: searchParams})
    },
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
                <th>Value</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.submissions.map((submission) => (
                <SubmissionRow
                  data={submission}
                  key={"submission-" + submission.id}
                />
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
  )
}

function Pagination({ activePage, prevPage, nextPage }: PaginationProps) {
  const searchParams = useSearchParams();
  const query: {[index: string]:any} = {};
  const queryClient = useQueryClient();
  const router = useRouter();

  searchParams.forEach((val: string, key: string) => {
    if (key === "page") return;
    query[key] = val;
  }, [query]);

  const mutatePage = useMutation({
    mutationFn: (pageNum: number) => router.push({query: {...query, page: pageNum}}),
    onSuccess: () => {
      queryClient.invalidateQueries(["submission"]);
      console.log(searchParams);
    }
  })

  return (
    <div className="join mx-auto mt-4">
      {prevPage && 
        <>
          <Link href={{ query: {...query, page: prevPage} }} className="join-item btn">{prevPage}</Link>
          <Link href={{ query: {...query, page: prevPage} }} className="join-item btn">{prevPage}</Link>
        </>
      }
      <button className="join-item btn btn-active">{activePage}</button>
      {nextPage && 
        <>
          <Link href={{ query: {...query, page: nextPage} }} className="join-item btn">{nextPage}</Link>
          <Link href={{ query: {...query, page: nextPage} }} className="join-item btn">»</Link>
        </>
      }
    </div>
  );
}

export default function SubmissionPage() {
  return (
    <div className="px-4 justify-center w-full">
      <div className="flex flex-row justify-between">
        <h2 className="py-2 text-2xl font-bold">Submission</h2>
      </div>
      <SubmissionPanel />
    </div>
  );
}
  