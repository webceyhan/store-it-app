"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Models } from "node-appwrite";

import { actionsDropdownItems } from "@/constants";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/file.actions";
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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FileDetails, ShareInput } from "./ActionsModalContent";

type Props = {
  file: Models.Document;
};

export default function ActionsDropdown({ file }: Props) {
  //
  const path = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<ActionDropdownItem | null>(null);
  const [name, setName] = useState<string>(file.name);
  const [emails, setEmails] = useState<string[]>([]);

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
  };

  const handleActions = async () => {
    if (!action) return;

    setIsLoading(true);

    const actions = {
      rename: () =>
        renameFile({
          fileId: file.$id,
          name,
          extension: file.extension,
          path,
        }),
      share: () =>
        updateFileUsers({
          fileId: file.$id,
          users: emails,
          path,
        }),
      delete: () =>
        deleteFile({
          fileId: file.$id,
          bucketFileId: file.bucketFileId,
          path,
        }),
    };

    const result = await actions[action.value as keyof typeof actions]();

    if (!!result) closeAllModals();

    setIsLoading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      users: updatedEmails,
      path,
    });

    if (success) setEmails(updatedEmails);

    closeAllModals();
  };

  const renderDialogContent = () => {
    // skip if no action is selected
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog  gap-5">
        <DialogHeader>
          <DialogTitle className="text-center text-light-100">
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

        {value === "details" && <FileDetails file={file} />}

        {value === "share" && (
          <ShareInput
            file={file}
            onChange={setEmails}
            onRemove={handleRemoveUser}
          />
        )}

        {value === "delete" && (
          <p className="delete-confirmation">
            Are you sure you want to delete{" "}
            <span className="delete-file-name">{file.name}</span>? This action
            cannot be undone.
          </p>
        )}

        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col md:items-center gap-3 md:flex-row">
            <Button
              className="modal-cancel-button"
              variant="secondary"
              onClick={closeAllModals}>
              Cancel
            </Button>

            <Button
              className="modal-submit-button capitalize"
              onClick={handleActions}>
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
