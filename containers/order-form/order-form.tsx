import React, { useEffect, useState, useCallback } from "react";
import { OrderForm as OrderFormComponent } from "@my-scope/ui.order-form";
import { addPosition, removePosition } from "@my-scope/services.positions";
import { getCurrentSymbol, getCurrentQuote } from "@my-scope/services.quotes";
import { Msg } from "@my-scope/utils.msg";

export const OrderForm = () => {
  const [currentSymbol, setCurrentSymbol] = useState(getCurrentSymbol());
  useEffect(() => {
    const symbol_changedFn = ({ symbol }) => {
      setCurrentSymbol(symbol);
    };
    Msg.on("symbol_changed", symbol_changedFn);
    return () => {
      Msg.remove("symbol_changed", symbol_changedFn);
    };
  }, []);

  const onSubmit = useCallback(
    async (values) => {
      if (values.action === "buy") {
        await addPosition({
          symbol: currentSymbol,
          symbolName: currentSymbol,
          type: values.type,
          qty: values.qty,
          purchasePrice: values.price,
        });
      } else {
        await removePosition({
          symbol: currentSymbol,
          type: values.type,
          qty: values.qty,
          price: values.price,
        });
      }
    },
    [currentSymbol]
  );

  if (!getCurrentQuote()) return null;

  return (
    <OrderFormComponent
      key={`order-form-${currentSymbol}`}
      onSubmit={onSubmit}
      initialValues={{
        type: "limit",
        price: getCurrentQuote().price,
        qty: 0,
        action: "buy",
      }}
    />
  );
};
