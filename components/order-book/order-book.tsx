import React, { forwardRef } from "react";
import styles from "./order-book.module.scss";
import { motion } from "framer-motion";

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

interface OrderBookOrder {
  price: number;
  amt: number;
  total: number;
}

interface OrderBookProps {
  buyers: OrderBookOrder[];
  sellers: OrderBookOrder[];
}

export const OrderBook = ({ buyers, sellers }: OrderBookProps) => {
  const sumTotalBuyers = buyers.reduce((sum, o) => sum + o.total, 0);
  const sumTotalSellers = sellers.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.chartWrapper}></div>
      <div className={styles.orderListWrapper}>
        <div className={styles.orderList}>
          {buyers.map((buyer) => (
            <OrderListItem
              key={`buyer_${buyer.price}_${buyer.amt}`}
              price={buyer.price}
              amount={buyer.amt}
              total={buyer.total}
              sumTotal={sumTotalBuyers}
            />
          ))}
        </div>
        <div className={styles.orderList}>
          {sellers.map((seller) => (
            <OrderListItem
              key={`seller_${seller.price}_${seller.amt}`}
              price={seller.price}
              amount={seller.amt}
              total={seller.total}
              sumTotal={sumTotalSellers}
              sell
            />
          ))}
        </div>
      </div>
    </div>
  );
};
