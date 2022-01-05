import React, { useState } from "react";
import styles from "./dashboard.module.scss";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Widget } from "@my-scope/ui.widget";
import Cookies from "js-cookie";
import { TimeSeriesChart, MOCK_DATA } from "@my-scope/ui.time-series-chart";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUTS = {
  lg: [
    { i: "a", x: 0, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "b", x: 3, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 6, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "d", x: 9, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
  ],
  md: [
    { i: "a", x: 0, y: 0, w: 5, h: 2, minW: 2, maxW: 4 },
    { i: "b", x: 5, y: 0, w: 5, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 0, y: 2, w: 10, h: 2, minW: 2, maxW: 4 },
    { i: "d", x: 0, y: 4, w: 10, h: 2, minW: 2, maxW: 4 },
  ],
  sm: [
    { i: "a", x: 0, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "b", x: 3, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 0, y: 2, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "d", x: 3, y: 2, w: 3, h: 2, minW: 2, maxW: 4 },
  ],
  xs: [
    { i: "a", x: 0, y: 0, w: 2, h: 2, minW: 2, maxW: 4 },
    { i: "b", x: 2, y: 0, w: 2, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 0, y: 2, w: 2, h: 2, minW: 2, maxW: 4 },
    { i: "d", x: 2, y: 2, w: 2, h: 2, minW: 2, maxW: 4 },
  ],
};

export const Dashboard = () => {
  const [layouts, _setLayouts] = useState(
    Cookies.get("dashboard_layout")
      ? JSON.parse(Cookies.get("dashboard_layout"))
      : DEFAULT_LAYOUTS
  );

  const setLayouts = (newLayouts) => {
    Cookies.set("dashboard_layout", JSON.stringify(newLayouts));
    _setLayouts(newLayouts);
  };

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.appBarWrapper}>
        <div className={styles.appBarLeft}>
          <h4 className={styles.title}>Test Stock Exchange</h4>
        </div>
        <div className={styles.appBarRight}>
          <button>Add Widget</button>
        </div>
      </div>
      <ResponsiveGridLayout
        className={styles.layoutWrapper}
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        draggableHandle={".headerHandler"}
        onLayoutChange={(_curLayout, allLayouts) => setLayouts(allLayouts)}
      >
        <Widget key="a">
          {/* <TimeSeriesChart kType="DAILY" symbol="TSLA" /> */}
          <TimeSeriesChart series={MOCK_DATA.series} meta={MOCK_DATA.meta} />
        </Widget>
        <Widget key="b">b</Widget>
        <Widget key="c">c</Widget>
        <Widget key="d">d</Widget>
      </ResponsiveGridLayout>
    </div>
  );
};
