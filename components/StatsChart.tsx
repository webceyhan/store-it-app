"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  calculatePercentage,
  convertFileSize,
  getUsageSummary,
} from "@/lib/utils";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CHART_CONFIG = {
  size: {
    label: "Size",
  },
  used: {
    label: "Used",
    color: "white",
  },
} satisfies ChartConfig;

type Props = {
  summaryList: ReturnType<typeof getUsageSummary>;
};

export default function StatsChart({ summaryList }: Props) {
  //
  const usedSize =
    summaryList.reduce((acc, { size }) => acc + size, 0);
  const usedPercentage = calculatePercentage(usedSize);

  const chartData = [
    {
      storage: "used",
      used: usedSize,
      fill: "white",
    },
  ];

  return (
    <Card className="chart">
      <CardContent className="flex-1 p-0">
        <ChartContainer config={CHART_CONFIG} className="chart-container">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 - usedPercentage * 3.6}
            innerRadius={80}
            outerRadius={140}>
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="polar-grid"
              polarRadius={[86, 74]}
            />

            <RadialBar dataKey="used" background />

            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="chart-total-percentage">
                          {usedPercentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-white/70">
                          Space used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <CardHeader className="chart-details">
        <CardTitle className="chart-title">Available Storage</CardTitle>

        <CardDescription className="chart-description">
          {usedSize ? convertFileSize(usedSize) : "2GB"} / 2GB
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
