import React from "react";
import { Widget } from "./widget";

export const OrderBooks = () => {
  return (
    <>
      <Widget title="Widget 1" renderRight={() => <button>right side</button>}>
        <p>Some content inside the widget</p>
      </Widget>
    </>
  );
};
