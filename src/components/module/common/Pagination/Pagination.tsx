import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  activePage: number;
  prevPage: number | undefined;
  nextPage: number | undefined;
}

export function Pagination({
  activePage,
  prevPage,
  nextPage,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const query: { [index: string]: any } = {};

  searchParams.forEach(
    (val: string, key: string) => {
      if (key === "page") return;
      query[key] = val;
    },
    [query]
  );

  return (
    <div className="join mx-auto mt-4">
      {prevPage && (
        <>
          <Link
            href={{ query: { ...query, page: prevPage } }}
            className="join-item btn"
          >
            «
          </Link>
          <Link
            href={{ query: { ...query, page: prevPage } }}
            className="join-item btn"
          >
            {prevPage}
          </Link>
        </>
      )}
      <button className="join-item btn btn-active">{activePage}</button>
      {nextPage && (
        <>
          <Link
            href={{ query: { ...query, page: nextPage } }}
            className="join-item btn"
          >
            {nextPage}
          </Link>
          <Link
            href={{ query: { ...query, page: nextPage } }}
            className="join-item btn"
          >
            »
          </Link>
        </>
      )}
    </div>
  );
}
