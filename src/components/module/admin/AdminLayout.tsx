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

export default function AdminLayout({
  children,
  className,
}: ComponentWithChildren) {
  return (
    <div>
      <h1 className="ml-4 py-4 text-2xl font-bold">Admin Panel</h1>
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-2">
          <ConfigMenu
            icon={<Crown size={24} />}
            title="Leaderboard"
            href="/admin/leaderboard"
          />
          <ConfigMenu
            icon={<Wrench size={24} />}
            title="Configuration"
            href="/admin/config"
          />
          <ConfigMenu
            icon={<Users size={24} />}
            title="Team"
            href="/admin/team"
          />
          <ConfigMenu
            icon={<HardDrives size={24} />}
            title="Server"
            href="/admin/server"
          />
          <ConfigMenu
            icon={<Flag size={24} />}
            title="Challenge"
            href="/admin/challenge"
          />
          <ConfigMenu
            icon={<Cloud size={24} />}
            title="Service"
            href="/admin/service"
          />
        </div>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
