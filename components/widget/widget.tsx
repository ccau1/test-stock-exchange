import React, { forwardRef } from "react";
import styles from "./widget.module.scss";

interface WidgetProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Widget = forwardRef(
  ({ children, style, className, ...props }: WidgetProps, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`${styles.mainWrapper} ${className}`}
        {...props}
      >
        <div className={`${styles.header} headerHandler`}></div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
);
