import { convertFileSize, getUsageSummary } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const MAX_SPACE = 2 * 1024 * 1024 * 1024; // 2 GB in bytes

type Props = {
  summaryList: ReturnType<typeof getUsageSummary>;
};

export default function StatsChart({ summaryList }: Props) {
  //
  const usedSize = summaryList.reduce((acc, { size }) => acc + size, 0);
  const totalCount = summaryList.reduce((acc, { count }) => acc + count, 0);
  const percentageUsed = ((usedSize / MAX_SPACE) * 100).toFixed(2);
  const remainingSpace = MAX_SPACE - usedSize;

  return (
    <Card className="chart">
      <CardContent className="flex-1 p-0"></CardContent>

      <CardHeader className="chart-details">
        <CardTitle className="chart-title">Available Storage</CardTitle>

        <CardDescription className="chart-description">
          {usedSize ? convertFileSize(usedSize) : "2GB"} / 2GB
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
