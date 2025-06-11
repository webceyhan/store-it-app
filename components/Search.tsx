"use client";

import { Models } from "node-appwrite";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { getFiles } from "@/lib/actions/file.actions";
import { constructFileUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";

export default function Search() {
  //
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search");

  const [term, setTerm] = useState<string>("");
  const [results, setResults] = useState<Models.Document[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await getFiles({ search: term });
      setResults(files);
      setIsOpen(files.length > 0);
    };

    fetchFiles();
  }, [term]);

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
                  className="flex items-center justify-between">
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
