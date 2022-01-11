import React from "react";
import styles from "./positions.module.scss";

interface Position {
  symbol: string;
  symbolName: string;
  qty: number;
  marketValue: number;
  purchasePrice: number;
  currentPrice: number;
  todayPL: number;
  totalPL: number;
  netPercent: number;
}

interface PositionsProps {
  positions: Position[];
  sortBy: string;
  sortAsc: boolean;
  onSortByClick: (sortBy: string) => void;
}

const sortField = (sortBy: string, sortAsc) => (a: Position, b: Position) => {
  if (!isNaN(parseFloat(a[sortBy]))) {
    // is a number
    return (sortAsc ? 1 : -1) * ((a[sortBy] as number) - (b[sortBy] as number));
  } else {
    // default to string
    return (sortAsc ? 1 : -1) * (a[sortBy] as string).localeCompare(b[sortBy]);
  }
};

const sortStyles = (id: string, currentSortBy: string, isAsc: boolean) => {
  if (id !== currentSortBy) return "";
  return isAsc ? styles.sortAsc : styles.sortDesc;
};

export const Positions = ({
  positions,
  sortBy,
  sortAsc,
  onSortByClick,
}: PositionsProps) => {
  return (
    <div className={styles.mainWrapper}>
      <div>
        <table className={styles.tableWrapper}>
          <thead>
            <tr>
              <th
                className={`${sortStyles("symbol", sortBy, sortAsc)}`}
                onClick={() => onSortByClick("symbol")}
              >
                Symbol
                {/* {sortBy === "symbol" && <div className={styles.arrow} />} */}
              </th>
              <th
                className={`${sortStyles("marketValue", sortBy, sortAsc)}`}
                onClick={() => onSortByClick("marketValue")}
              >
                MV/QTY
              </th>
              <th
                className={`${sortStyles("currentPrice", sortBy, sortAsc)}`}
                onClick={() => onSortByClick("currentPrice")}
              >
                Price/Cost
              </th>
              <th
                className={`${sortStyles("todayPL", sortBy, sortAsc)}`}
                onClick={() => onSortByClick("todayPL")}
              >
                Today's P/L
              </th>
              <th
                className={`${sortStyles("totalPL", sortBy, sortAsc)}`}
                onClick={() => onSortByClick("totalPL")}
              >
                PL
              </th>
              <th
                className={`${sortStyles("netPercent", sortBy, sortAsc)}`}
                onClick={() => onSortByClick("netPercent")}
              >
                % Positions
              </th>
            </tr>
          </thead>
          <tbody>
            {positions.sort(sortField(sortBy, sortAsc)).map((position) => (
              <PositionTableRow
                key={`table_row_${position.symbol}`}
                {...position}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PositionTableRow = ({
  symbol,
  symbolName,
  qty,
  marketValue,
  purchasePrice,
  netPercent,
  currentPrice,
  totalPL,
  todayPL,
}) => {
  return (
    <tr className={styles.tableRow}>
      <td>
        <p>{symbol}</p>
        <small>{symbolName}</small>
      </td>
      <td>
        <p>
          {marketValue.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </p>
        <small>{qty}</small>
      </td>
      <td>
        <p>
          {currentPrice.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </p>
        <small>
          {purchasePrice.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </small>
      </td>
      <td>
        <p
          className={
            todayPL === 0 ? "" : todayPL >= 0 ? styles.green : styles.red
          }
        >
          {todayPL > 0 ? "+" : ""}
          {todayPL.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </p>
      </td>
      <td>
        <p
          className={
            totalPL === 0 ? "" : totalPL >= 0 ? styles.green : styles.red
          }
        >
          {totalPL > 0 ? "+" : ""}
          {totalPL.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </p>
      </td>
      <td>
        <p>{netPercent.toFixed(2)}%</p>
      </td>
    </tr>
  );
};
