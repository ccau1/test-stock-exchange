import React from "react";

export type TimeSeriesChartKType = "DAILY" | "WEEKLY" | "MONTHLY";

interface SeriesData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Series {
  [dateTime: string]: SeriesData;
}

interface SeriesMeta {
  info: string;
  symbol: string;
  lastRefreshed: string;
  outputSize: string;
  timeZone: string;
}

interface TimeSeriesChartProps {
  meta: SeriesMeta;
  series: Series;
}

export const TimeSeriesChart = ({ series, meta }: TimeSeriesChartProps) => {
  console.log("data", series, meta);

  return <div>test</div>;
};
