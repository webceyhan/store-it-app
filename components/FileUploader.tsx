"use client";

import React, { MouseEvent, useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import { Button } from "./ui/button";

type Props = {
  ownerId: string;
  accountId: string;
  className?: string;
};

export default function FileUploader({ ownerId, accountId, className }: Props) {
  //
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

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

      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}
