import {
  Cloud,
  Crown,
  Flag,
  HardDrives,
  Users,
  Wrench,
} from "@phosphor-icons/react";
import React, { ReactElement } from "react";
import type { Icon } from "@phosphor-icons/react";
import { ComponentWithChildren } from "@/types/common";
import Link from "next/link";
import { useContestContext } from "../ContestContext";

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
  return (
    <div>
      <h1 className="ml-4 py-4 text-2xl font-bold">{contest.event_name}</h1>
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-2">
          <ConfigMenu
            icon={<Flag size={24} />}
            title="Challenges"
            href="/admin/challenge"
          />
          <ConfigMenu
            icon={<Cloud size={24} />}
            title="My Service"
            href="/admin/service"
          />
          <ConfigMenu
            icon={<Crown size={24} />}
            title="Leaderboard"
            href="/admin/leaderboard"
          />
        </div>
        <div className={"w-full " + className}>{children}</div>
      </div>
    </div>
  );
}
