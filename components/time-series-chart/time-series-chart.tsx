import React, { useLayoutEffect, useRef } from "react";
import { createChart, IChartApi } from "lightweight-charts";
import styles from "./time-series-chart.module.scss";
import { useResize } from "@my-scope/hooks.use-resize";

export type TimeSeriesChartKType = "DAILY" | "WEEKLY" | "MONTHLY";

interface SeriesData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
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
  series: SeriesData[];
  isLoading?: boolean;
}

export const TimeSeriesChart = ({
  series,
  meta,
  isLoading,
}: TimeSeriesChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartObjRef = useRef<IChartApi>(null);

  const { width, height, ref } = useResize();

  useLayoutEffect(() => {
    if (!series) return;
    chartRef.current.innerHTML = "";
    chartObjRef.current = createChart(chartRef.current, {
      width,
      height,
    });

    const chart = chartObjRef.current;

    const candlestickSeries = chart.addCandlestickSeries();

    candlestickSeries.setData(JSON.parse(JSON.stringify(series)));
  }, [series, meta]);

  useLayoutEffect(() => {
    chartObjRef.current?.resize(width, height);
  }, [width, height]);

  return (
    <div
      ref={ref}
      className={`${styles.mainWrapper} ${isLoading ? styles.loading : ""}`}
    >
      <div ref={chartRef} id="chart" className={styles.chart} />
    </div>
  );
};
