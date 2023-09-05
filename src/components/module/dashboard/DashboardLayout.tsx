import {
  Cloud,
  Crown,
  Flag,
  HardDrives,
  SignOut,
  Users,
  Wrench,
} from "@phosphor-icons/react";
import React, { ReactElement, useEffect, useMemo } from "react";
import type { Icon } from "@phosphor-icons/react";
import { ComponentWithChildren } from "@/types/common";
import Link from "next/link";
import { useContestContext } from "../ContestContext";
import { useAtom } from "jotai";
import { authTokenAtom } from "@/components/states";
import { useRouter } from "next/router";
import { Team } from "@/types/team";
import { parseJwt } from "@/components/utils";

interface ConfigMenuProps {
  icon: ReactElement<Icon>;
  title: string;
  href: string;
}

function ConfigMenu({ icon, title, href }: ConfigMenuProps) {
  return (
    <Link
      href={href}
      className="flex flex-row gap-2 items-center py-3 px-4 hover:bg-neutral rounded-r-full hover:cursor-pointer"
    >
      {icon}
      {title}
    </Link>
  );
}

export default function DashboardLayout({
  children,
  className,
}: ComponentWithChildren) {
  const { contest } = useContestContext();
  const [authToken, setAuthToken] = useAtom(authTokenAtom);
  const router = useRouter();

  const parsedJwt = useMemo(
    () => parseJwt<{ sub: { team: Team<"share"> } }>(authToken),
    [authToken]
  );

  useEffect(() => {
    if (!!!authToken && router) router.replace("/");
  }, [authToken, router]);

  return (
    <div>
      <h1 className="ml-4 py-4 text-2xl font-bold">{contest.event_name}</h1>
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-2 basis-[24rem]">
          <ConfigMenu
            icon={<Flag size={24} />}
            title="Challenges"
            href="/dashboard"
          />
          <ConfigMenu
            icon={<Cloud size={24} />}
            title="My Service"
            href="/dashboard/service"
          />
          <ConfigMenu
            icon={<Crown size={24} />}
            title="Leaderboard"
            href="/leaderboard"
          />

          <a
            className="flex flex-row gap-2 items-center py-3 px-4 hover:bg-neutral rounded-r-full hover:cursor-pointer"
            onClick={() => {
              setAuthToken("");
              router.push("/");
            }}
          >
            <SignOut size={24} />
            Sign out
          </a>

          <div className="divider my-2"></div>

          <div className="flex flex-col gap-2 px-4">
            <strong className="font-bold text-xl">Auth Token</strong>
            <strong>Team ID: {parsedJwt?.sub.team.id}</strong>
            <strong>Team Name: {parsedJwt?.sub.team.name}</strong>
            <code className="break-all p-4 rounded-md bg-base-300 text-sm">
              {authToken}
            </code>
            <p>
              This is your team&apos;s JWT token. You may share it with your
              team mates to put it inside <code>authToken</code> key of the
              browser&apos;s local storage.
            </p>
          </div>
        </div>
        <div className={"w-full " + className}>{children}</div>
      </div>
    </div>
  );
}
