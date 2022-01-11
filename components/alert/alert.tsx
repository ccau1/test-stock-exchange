import React from "react";
import styles from "./alert.module.scss";

type AlertColor = "info" | "warning" | "danger" | "success";

const getColorStyle = (color: AlertColor) => {
  switch (color) {
    case "warning":
      return styles.warning;
    case "danger":
      return styles.danger;
    case "success":
      return styles.success;
    case "info":
    default:
      return styles.info;
  }
};

interface AlertProps {
  color?: AlertColor;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Alert = ({
  color = "info",
  children,
  style,
  className,
}: AlertProps) => {
  return (
    <div
      className={`${styles.mainWrapper} ${getColorStyle(color)} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
