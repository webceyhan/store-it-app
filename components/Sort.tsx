"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortTypes } from "@/constants";
import { usePathname, useRouter } from "next/navigation";

export default function Sort() {
  //
  const path = usePathname();
  const router = useRouter();

  const handleSortChange = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };

  return (
    <Select onValueChange={handleSortChange} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>

      <SelectContent className="sort-select-content">
        {sortTypes.map(({ label, value }) => (
          <SelectItem key={value} value={value} className="shad-select-item">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
