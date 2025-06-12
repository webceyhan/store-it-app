import Image from "next/image";
import Link from "next/link";

import FormattedDateTime from "@/components/FormattedDateTime";
import StatsChart from "@/components/StatsChart";
import { Separator } from "@/components/ui/separator";
import { getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";

export default async function Dashboard() {
  //
  const usageData = await getTotalSpaceUsed();
  const summaryList = getUsageSummary(usageData);

  return (
    <div className="dashboard-container">
      <StatsChart summaryList={summaryList} />

      {/* upload summary cards */}
      <ul className="dashboard-summary-list">
        {summaryList.map(({ title, icon, url, count, size, latestDate }) => (
          <Link key={title} href={url} className="dashboard-summary-card">
            <div className="space-y-4">
              <div className="flex justify-between gap-3">
                <Image
                  src={icon}
                  width={100}
                  height={100}
                  alt={title}
                  className="summary-type-icon"
                />

                <h4 className="summary-type-size">{convertFileSize(size)}</h4>
              </div>

              <h5 className="summary-type-title">
                {title}{" "}
                <small className="ml-2 text-light-200">({count} files)</small>
              </h5>

              <Separator className="bg-light-400" />

              <FormattedDateTime date={latestDate} className="text-center" />
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
}
