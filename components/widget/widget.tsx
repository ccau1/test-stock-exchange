import React, { forwardRef } from "react";
import styles from "./widget.module.scss";

interface WidgetProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  title?: string;
  renderRight?: () => React.ReactNode;
}

export const Widget = forwardRef(
  (
    { children, style, className, title, renderRight, ...props }: WidgetProps,
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`${styles.mainWrapper} ${className}`}
        {...props}
      >
        <div className={`${styles.header} headerHandler`}>
          <div className={styles.headerLeft}>
            {!!title && <h5 className={styles.title}>{title}</h5>}
          </div>
          <div className={`${styles.headerRight} headerHandlerCancel`}>
            {renderRight?.()}
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    );
  }
);
