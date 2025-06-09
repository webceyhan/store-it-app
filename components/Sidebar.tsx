"use client";

import { usePathname } from "next/navigation";
import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Props = {
  fullName: string;
  avatar: string;
  email: string;
};

export default function Sidebar({ fullName, avatar, email }: Props) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="max-lg:hidden h-auto"
        />

        <Image
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="lg:hidden"
        />
      </Link>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => {
            const isActive = pathname === url;

            return (
              <Link href={url} key={name} className="lg:w-full">
                <li
                  className={cn("sidebar-nav-item", isActive && "shad-active")}>
                  <Image
                    src={icon}
                    alt={name}
                    width={24}
                    height={24}
                    className={cn("nav-icon", isActive && "nav-icon-active")}
                  />

                  <p className="max-lg:hidden">{name}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>

      <Image
        src="/assets/images/files-2.png"
        alt="files"
        width={506}
        height={418}
        className="w-full"
      />

      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt="user avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />

        <div className="max-lg:hidden">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="text-xs text-gray-600">{email}</p>
        </div>
      </div>
    </aside>
  );
}
