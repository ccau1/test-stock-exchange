import React from "react";
import { Positions } from "./positions";

export const OrderBooks = () => {
  return (
    <>
      <Positions
        sortBy={"marketValue"}
        onSortByClick={(sortBy) => console.log("toggle sort by", sortBy)}
        positions={[
          {
            symbol: "TSLA",
            symbolName: "Tesla",
            qty: 30,
            marketValue: 34200,
            purchasePrice: 830,
            currentPrice: 1140,
            todayPL: 10,
            totalPL: 300,
            netPercent: 21,
          },
          {
            symbol: "AAPL",
            symbolName: "Apple",
            qty: 10,
            marketValue: 2800,
            purchasePrice: 220,
            currentPrice: 280,
            todayPL: 4,
            totalPL: 60,
            netPercent: 6,
          },
        ]}
      />
    </>
  );
};
