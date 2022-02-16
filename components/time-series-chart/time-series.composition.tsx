import React from "react";
import { TimeSeriesChart } from "./time-series-chart";
import { MOCK_DATA } from "./mock-data";

export const OrderBooks = () => {
  return (
    <>
      <TimeSeriesChart series={MOCK_DATA.series} meta={MOCK_DATA.meta} />
    </>
  );
};
