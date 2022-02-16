import React from "react";
import { OrderBook } from "./order-book";

export const OrderBooks = () => {
  return (
    <>
      <OrderBook
        buyers={[
          { price: 12, amt: 2, total: 24 },
          { price: 11.93, amt: 10, total: 119.3 },
        ]}
        sellers={[
          { price: 12.1, amt: 10, total: 121.0 },
          { price: 12.4, amt: 4, total: 49.6 },
        ]}
      />
    </>
  );
};
