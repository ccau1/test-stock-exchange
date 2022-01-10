import React from "react";
import styles from "./order-book.module.scss";
import { OrderListItem } from "./order-book-item";

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
