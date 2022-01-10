import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import styles from "./order-book.module.scss";

interface OrderListItemProps {
  price: number;
  amount: number;
  total: number;
  sumTotal: number;
  sell?: boolean;
  key?: string;
}

export const OrderListItem = forwardRef(
  (
    { price, amount, total, sumTotal, sell, ...props }: OrderListItemProps,
    ref
  ) => {
    return (
      <motion.div
        {...props}
        ref={ref}
        className={`${styles.orderListItem} ${
          sell ? styles.seller : styles.buyer
        }`}
        initial={{
          backgroundColor: sell
            ? "rgba(235, 14, 14, 0.2)"
            : "rgba(0, 150, 255, 0.2)",
        }}
        animate={{
          backgroundColor: sell
            ? "rgba(235, 14, 14, 0)"
            : "rgba(0, 150, 255, 0)",
        }}
      >
        <p className={styles.price}>
          {price.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </p>
        <p>{amount}</p>
        {/* <p>{total.toFixed(2)}</p> */}
        <div
          className={`${styles.orderListItemSumPercentage} ${
            sell ? styles.seller : styles.buyer
          }`}
          style={{ width: `${(total / sumTotal) * 100}%` }}
        />
      </motion.div>
    );
  }
);
