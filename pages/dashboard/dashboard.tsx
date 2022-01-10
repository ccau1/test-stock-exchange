import React, { useState, useEffect, useRef } from "react";
import styles from "./dashboard.module.scss";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Widget } from "@my-scope/ui.widget";
import Cookies from "js-cookie";
import { TimeSeriesChart } from "@my-scope/containers.time-series-chart";
import { OrderBook } from "@my-scope/containers.order-book";
import { Positions } from "@my-scope/containers.positions";
import { OrderForm } from "@my-scope/containers.order-form";
import { DEFAULT_LAYOUTS } from "./data";
import { setCurrentSymbol, getCurrentQuote } from "@my-scope/services.quotes";
import { Msg } from "@my-scope/utils.msg";

const ResponsiveGridLayout = WidthProvider(Responsive);

export const Dashboard = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [layouts, _setLayouts] = useState(
    Cookies.get("dashboard_layout")
      ? JSON.parse(Cookies.get("dashboard_layout"))
      : DEFAULT_LAYOUTS
  );
  const [currentSymbol, _setCurrentSymbol] = useState(
    getCurrentQuote()?.symbol
  );
  const [isLoading, setIsLoading] = useState(false);

  const setLayouts = (newLayouts) => {
    Cookies.set("dashboard_layout", JSON.stringify(newLayouts));
    _setLayouts(newLayouts);
  };

  useEffect(() => {
    const onErrorFn = (err: Error) => {
      setErrorMessage(err.message);
      setIsLoading(false);
    };
    const onCompleteFn = ({ symbol }) => {
      setErrorMessage("");
      _setCurrentSymbol(symbol);
      setSymbolInput(symbol);
      setIsLoading(false);
    };
    Msg.on("error_setSymbol", onErrorFn);
    Msg.on("symbol_changed", onCompleteFn);

    return () => {
      Msg.remove("error_setSymbol", onErrorFn);
      Msg.remove("symbol_changed", onCompleteFn);
    };
  }, []);

  const [symbolInput, setSymbolInput] = useState(currentSymbol || "");

  const symbolInputRef = useRef<HTMLInputElement>(null);

  const [kType, setKType] = useState<"DAILY" | "WEEKLY" | "MONTHLY">("DAILY");
  const kTypeOptions = [
    { value: "DAILY", text: "1D" },
    { value: "WEEKLY", text: "1W" },
    { value: "MONTHLY", text: "1M" },
  ];

  return (
    <div className={styles.mainWrapper}>
      <div
        className={`${styles.appBarWrapper} ${isLoading ? styles.loading : ""}`}
      >
        <div className={styles.appBarLeft}>
          <h4 className={styles.title}>Test Stock Exchange</h4>
          <input
            className={styles.stockSymbolInput}
            type="text"
            placeholder="stock symbol"
            ref={symbolInputRef}
            value={symbolInput}
            onChange={(ev) => setSymbolInput(ev.target.value.toUpperCase())}
            onKeyDown={(ev) => {
              if (ev.code === "Enter") {
                setIsLoading(true);
                setCurrentSymbol(symbolInput);
                symbolInputRef.current?.blur();
              }
            }}
            disabled={isLoading}
          />
          {!!errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
        <div className={styles.appBarRight}>
          <button disabled>Add Widget</button>
        </div>
      </div>
      <ResponsiveGridLayout
        className={styles.layoutWrapper}
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        draggableHandle={".headerHandler"}
        draggableCancel={".headerHandlerCancel"}
        onLayoutChange={(_curLayout, allLayouts) => setLayouts(allLayouts)}
      >
        <Widget key="orderForm_01" title={`Order Form (${currentSymbol})`}>
          <OrderForm />
        </Widget>
        <Widget
          key="timeSeries_01"
          title={`Chart (${currentSymbol})`}
          renderRight={() => (
            <div className={styles.kTypeButtonList}>
              {kTypeOptions.map((option) => (
                <button
                  className={kType === option.value ? styles.selected : ""}
                  key={option.value}
                  onClick={() => setKType(option.value)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
        >
          <TimeSeriesChart symbol={currentSymbol} kType={kType} />
        </Widget>
        <Widget key="orderBook_01" title={`Order Book (${currentSymbol})`}>
          <OrderBook />
        </Widget>
        <Widget key="positions_01" title="Positions">
          <Positions />
        </Widget>
      </ResponsiveGridLayout>
    </div>
  );
};
