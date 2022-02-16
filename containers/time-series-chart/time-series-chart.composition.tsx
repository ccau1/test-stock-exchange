import React from "react";
import { TimeSeriesChart } from "./time-series-chart";

export const BasicTimeSeriesChart = () => {
  return (
    <div>
      <TimeSeriesChart kType="DAILY" symbol="TSLA" />
    </div>
  );
};
