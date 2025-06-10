import { Models } from "node-appwrite";
import Link from "next/link";

import { constructFileUrl, convertFileSize } from "@/lib/utils";
import ActionsDropdown from "./ActionsDropdown";
import FormattedDateTime from "./FormattedDateTime";
import Thumbnail from "./Thumbnail";

type Props = {
  file: Models.Document;
};

export default function Card({ file }: Props) {
  const fileUrl = constructFileUrl(file.bucketFileId);

  return (
    <Link href={fileUrl} target="_blank" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={fileUrl}
          className="size-20!"
          imageClassName="size-11!"
        />

        <div className="flex flex-col items-end justify-between">
          <ActionsDropdown />
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">{file.name}</p>

        <FormattedDateTime
          date={file.$createdAt}
          className="body-2 text-light-100"
        />

        <p className="caption line-clamp-1 text-light-200">
          By: {file.owner.fullName}
        </p>
      </div>
    </Link>
  );
}
