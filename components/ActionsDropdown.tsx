"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Models } from "node-appwrite";

import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import { ActionDropdownItem } from "@/types";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  file: Models.Document;
};

export default function ActionsDropdown({ file }: Props) {
  //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionDropdownItem | null>(null);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="Open menu"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {actionsDropdownItems.map((item) => {
            const isDownloadAction = item.value === "download";
            const LinkOrDiv = isDownloadAction ? Link : "div";

            return (
              <DropdownMenuItem
                className="shad-dropdown-item"
                key={item.label}
                onClick={() => {
                  setAction(item);
                  setIsModalOpen(!isDownloadAction);
                }}>
                <LinkOrDiv
                  className="flex items-center gap-2"
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}>
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={30}
                    height={30}
                  />
                  {item.label}
                </LinkOrDiv>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
