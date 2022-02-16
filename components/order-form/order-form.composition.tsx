import React from "react";
import { OrderForm } from "./order-form";

export const OrderBooks = () => {
  return (
    <>
      <OrderForm onSubmit={(values) => alert(values)} />
    </>
  );
};
