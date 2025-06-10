"use client";

import { MouseEvent, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { MAX_FILE_SIZE } from "@/constants";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import { uploadFile } from "@/lib/actions/file.actions";
import { Button } from "./ui/button";
import Thumbnail from "./Thumbnail";

type Props = {
  ownerId: string;
  accountId: string;
  className?: string;
};

export default function FileUploader({ ownerId, accountId, className }: Props) {
  //
  const path = usePathname();

  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadedPromises = acceptedFiles.map(async (file) => {
        // to be implemented: upload file to the server

        if (file.size > MAX_FILE_SIZE) {
          setFiles((prev) => prev.filter((f) => f.name !== file.name));

          return toast.error(
            <p className="body-2 text-white">
              <span className="font-semibold">{file.name}</span>
              is too large. Maximum file size is 50MB
            </p>,
            { className: "error-toast" }
          );
        }

        return uploadFile({
          file,
          ownerId,
          accountId,
          path,
        }).then((uploadedFile) => {
          if (uploadedFile) {
            setFiles((prev) => prev.filter((f) => f.name !== file.name));
          }
        });
      });

      await Promise.all(uploadedPromises);
    },
    [ownerId, accountId, path]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveFile = (
    event: MouseEvent<HTMLImageElement>,
    fileName: string
  ) => {
    event.stopPropagation();
    setFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="Upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h4 className="h4 text-light-100">Uploading</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item">
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}

                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt="Loading"
                      width={80}
                      height={26}
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  alt="Remove"
                  width={24}
                  height={24}
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
