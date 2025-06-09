import { cn, getFileIcon } from "@/lib/utils";
import Image from "next/image";

type Props = {
  type: string;
  extension: string;
  url?: string;
  className?: string;
  imageClassName?: string;
};

export default function Thumbnail({
  type,
  extension,
  className,
  imageClassName,
  url = "",
}: Props) {
  //
  const isImage = type === "image" && extension !== "svg";
  const src = isImage ? url : getFileIcon(extension, type);

  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={src}
        alt={`thumbnail`}
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain",
          isImage && "thumbnail-image",
          imageClassName
        )}
      />
    </figure>
  );
}
