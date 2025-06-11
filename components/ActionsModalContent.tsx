import { Models } from "node-appwrite";
import Image from "next/image";

import { constructFileUrl, convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";

export default function ActionsModalContent({}) {
  return <div>demo</div>;
}

type ImageThumbnailProps = {
  file: Models.Document;
};

const ImageThumbnail = ({ file }: ImageThumbnailProps) => {
  return (
    <div className="file-details-thumbnail">
      <Thumbnail
        type={file.type}
        extension={file.extension}
        url={constructFileUrl(file.bucketFileId)}
      />
      <div className="flex flex-col">
        <p className="subtitle-2 mb-1">{file.name}</p>
        <FormattedDateTime date={file.$createdAt} className="caption" />
      </div>
    </div>
  );
};

type DetailRowProps = {
  label: string;
  value: string;
};

const DetailRow = ({ label, value }: DetailRowProps) => {
  return (
    <div className="flex">
      <p className="file-details-label">{label}</p>
      <p className="file-details-value">{value}</p>
    </div>
  );
};

type FileDetailsProps = {
  file: Models.Document;
};

export const FileDetails = ({ file }: FileDetailsProps) => {
  return (
    <>
      <ImageThumbnail file={file} />

      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owner.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};

type ShareInputProps = {
  file: Models.Document;
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
};

export const ShareInput = ({ file, onChange, onRemove }: ShareInputProps) => {
  return (
    <>
      <ImageThumbnail file={file} />

      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>

        <Input
          type="email"
          placeholder="Enter email"
          className="share-input-field"
          onChange={(e) => onChange(e.target.value.trim().split(","))}
        />

        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100"> Shared with</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} user{file.users.length > 1 ? "s" : ""}
            </p>
          </div>

          <ul className="pt-2">
            {file.users.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2">
                <p className="subtitle-2">{email}</p>

                <Button
                  className="share-remove-user"
                  onClick={() => onRemove(email)}>
                  <Image
                    className="remove-icon"
                    src="/assets/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
