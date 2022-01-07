import React from "react";
import { TimeSeriesChart as TimeSeriesChartComponent } from "@my-scope/ui.time-series-chart";
import {
  TimeSeriesChartKType,
  getTimeSeriesData,
} from "@my-scope/services.quotes";
import useSWR from "swr";

interface TimeSeriesChartProps {
  kType: TimeSeriesChartKType;
  symbol: string;
}

export const TimeSeriesChart = ({ kType, symbol }: TimeSeriesChartProps) => {
  const { data, error } = useSWR(
    kType && symbol ? [kType, symbol] : null,
    async (kType, symbol) => getTimeSeriesData({ kType, symbol })
  );

  return (
    <TimeSeriesChartComponent
      series={data?.series}
      meta={data?.meta}
      isLoading={!data}
    />
  );
};
