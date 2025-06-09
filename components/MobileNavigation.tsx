"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import FileUploader from "./FileUploader";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

type Props = {
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
  signOutUser: () => Promise<void>;
};

export default function MobileNavigation({
  fullName,
  email,
  avatar,
  accountId,
  signOutUser,
}: Props) {
  //
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="mobile-header">
      <Image
        src="/assets/icons/logo-full-brand.svg"
        alt="Logo"
        width={120}
        height={52}
        className="h-auto"
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="Menu"
            width={24}
            height={24}
          />
        </SheetTrigger>

        <SheetContent className="shad-sheet h-screen px-3">
          <SheetHeader>
            <SheetTitle>
              <div className="header-user">
                <Image
                  src={avatar}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="header-user-avatar"
                />
                <div className="sm:hidden lg:block">
                  <p className="subtitle-2 capitalize">{fullName}</p>
                  <p className="caption">{email}</p>
                </div>
              </div>

              <Separator className="mb-4 bg-light-200/20" />
            </SheetTitle>

            <nav className="mobile-nav">
              <ul className="mobile-nav-list">
                {navItems.map(({ url, name, icon }) => {
                  const isActive = pathname === url;

                  return (
                    <Link href={url} key={name} className="lg:w-full">
                      <li
                        className={cn(
                          "mobile-nav-item",
                          isActive && "shad-active"
                        )}>
                        <Image
                          src={icon}
                          alt={name}
                          width={24}
                          height={24}
                          className={cn(
                            "nav-icon",
                            isActive && "nav-icon-active"
                          )}
                        />

                        <p>{name}</p>
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </nav>

            <Separator className="my-5 bg-light-200/20" />

            <div className="flex flex-col justify-between gap-5">
              <FileUploader />

              <form action={async () => signOutUser()}>
                <Button type="submit" className="mobile-sign-out-button">
                  <Image
                    src="/assets/icons/logout.svg"
                    alt="Sign Out"
                    width={24}
                    height={24}
                  />
                  <p>Logout</p>
                </Button>
              </form>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </header>
  );
}
