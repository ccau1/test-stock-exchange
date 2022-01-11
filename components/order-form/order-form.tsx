import React, { useState } from "react";
import styles from "./order-form.module.scss";
import { Formik, ErrorMessage as ErrorMessageBase } from "formik";
import * as Yup from "yup";

const ErrorMessage = ({ name }) => (
  <div className={styles.fieldError}>
    <ErrorMessageBase name={name} />
  </div>
);

const validationSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(["limit", "market", "stopLimit", "trailingStopLimit"])
    .required(),
  price: Yup.number().min(0.01).required(),
  qty: Yup.number().min(1).required(),
  action: Yup.string().oneOf(["buy", "sell"]).required(),
});

interface FormValues {
  type: "limit" | "market" | "stopLimit" | "trailingStopLimit";
  price: number;
  qty: number;
  action: "buy" | "sell";
}

interface OrderFormProps {
  onSubmit: (values) => void;
  initialValues?: FormValues;
}

export const OrderForm = ({
  onSubmit,
  initialValues = {
    type: "limit",
    price: 0,
    qty: 0,
    action: "buy",
  },
}: OrderFormProps) => {
  const [error, setError] = useState("");
  return (
    <div className={styles.mainWrapper}>
      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          try {
            await onSubmit(values);
          } catch (err) {
            setError((err as Error).message);
            return;
          } finally {
            setSubmitting(false);
          }
          setError("");
          resetForm();
        }}
      >
        {({
          isSubmitting,
          values,
          setValues,
          handleSubmit,
          handleChange,
          handleBlur,
        }) => (
          <>
            <div className={styles.fieldWrapper}>
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.type}
              >
                <option value="limit">Limit</option>
                <option value="market">Market</option>
                <option value="stopLimit">Stop Limit</option>
                <option value="trailingStopLimit">Trailing Stop Limit</option>
              </select>
            </div>
            <ErrorMessage name="type" />
            <div className={styles.fieldWrapper}>
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                name="price"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.price || ""}
              />
            </div>
            <ErrorMessage name="price" />
            <div className={styles.fieldWrapper}>
              <label htmlFor="qty">Qty</label>
              <input
                id="qty"
                type="number"
                name="qty"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.qty || ""}
              />
            </div>
            <ErrorMessage name="qty" />
            <div className={styles.buttonWrapper}>
              <button
                onClick={() => {
                  setValues({ ...values, action: "buy" });
                  handleSubmit();
                }}
                disabled={isSubmitting}
                className={styles.buyButton}
              >
                BUY
              </button>
              <button
                onClick={() => {
                  setValues({ ...values, action: "sell" });
                  handleSubmit();
                }}
                disabled={isSubmitting}
                className={styles.sellButton}
              >
                SELL
              </button>
            </div>
            <div className={styles.fieldError} style={{ marginTop: 10 }}>
              {error}
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};
