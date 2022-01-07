import React, { useState, useEffect } from "react";
import { OrderBook as OrderBookComponent } from "@my-scope/ui.order-book";
import { Msg } from "@my-scope/utils.msg";
import { orderBookBuys, orderBookSells } from "@my-scope/services.quotes";
import { useForceUpdate } from "@my-scope/hooks.use-force-update";

export const OrderBook = () => {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const symbol_changedFn = ({ symbol, symbolQuote }) => {
      forceUpdate();
    };
    Msg.on("symbol_changed", symbol_changedFn);

    const orderBook_changeFn = ({ isSell, orderBookBuys, orderBookSells }) => {
      forceUpdate();
    };
    Msg.on("orderBook_change", orderBook_changeFn);

    return () => {
      Msg.remove("symbol_changed", symbol_changedFn);
      Msg.remove("orderBook_change", orderBook_changeFn);
    };
  }, []);

  return (
    <OrderBookComponent
      buyers={orderBookBuys.slice(0, 20)}
      sellers={orderBookSells.slice(0, 20)}
    />
  );
};
