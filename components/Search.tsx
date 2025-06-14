"use client";

import { Models } from "node-appwrite";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

import { getFiles } from "@/lib/actions/file.actions";
import { constructFileUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { useRouter } from "next/navigation";

const TYPE_CATEGORY_MAP = {
  audio: "media",
  video: "media",
  image: "images",
  document: "documents",
  other: "others",
};

export default function Search() {
  //
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");
  const router = useRouter();
  const path = usePathname();

  const [term, setTerm] = useState<string>("");
  const [results, setResults] = useState<Models.Document[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedTerm] = useDebounce(term, 500);

  const handleClickItem = (file: Models.Document) => {
    setIsOpen(false);
    setResults([]);

    const type = file.type as keyof typeof TYPE_CATEGORY_MAP;
    router.push(`${TYPE_CATEGORY_MAP[type]}?search=${debouncedTerm}`);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      // reset search term if it is empty
      if (debouncedTerm.length === 0) {
        setResults([]);
        setIsOpen(false);
        router.push(path.split("?")[0]);
        return;
      }

      const files = await getFiles({ search: debouncedTerm });
      setResults(files);
      setIsOpen(files.length > 0);
    };

    fetchFiles();
  }, [debouncedTerm, path, router]);

  useEffect(() => {
    if (searchTerm) {
      setTerm(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />

        <Input
          className="search-input"
          placeholder="Search..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />

        {isOpen && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <li
                  key={file.$id}
                  className="flex items-center justify-between"
                  onClick={() => handleClickItem(file)}>
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={constructFileUrl(file.bucketFileId)}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>

                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
