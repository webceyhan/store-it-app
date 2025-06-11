"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Models } from "node-appwrite";

import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import { ActionDropdownItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  file: Models.Document;
};

export default function ActionsDropdown({ file }: Props) {
  //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<ActionDropdownItem | null>(null);
  const [name, setName] = useState<string>(file.name);

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
  };

  const handleActions = async () => {
    // ... handle the action based on the selected item
  };

  const renderDialogContent = () => {
    // skip if no action is selected
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog  gap-5">
        <DialogHeader>
          <DialogTitle className="text-center- text-light-100">
            {label}
          </DialogTitle>
        </DialogHeader>

        {value === "rename" && (
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col md:items-center gap-3 md:flex-row">
            <Button
              className="modal-cancel-button"
              variant="secondary"
              onClick={closeAllModals}>
              Cancel
            </Button>

            <Button className="modal-submit-button capitalize">
              {value}

              {isLoading && (
                <Image
                  className="animate-spin"
                  src="/assets/icons/loader.svg"
                  alt="Loading"
                  width={24}
                  height={24}
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

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

      {renderDialogContent()}
    </Dialog>
  );
}
