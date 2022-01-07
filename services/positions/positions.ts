import { Msg } from "@my-scope/utils.msg";
import Cookies from "js-cookie";

interface Position {
  symbol: string;
  symbolName: string;
  qty: number;
  purchasePrice: number;
}

type TradeType = "limit" | "market" | "stopLimit" | "trailingStopLimit";

export const positions: { [symbol: string]: Position } = Cookies.get(
  "trade_positions"
)
  ? JSON.parse(Cookies.get("trade_positions"))
  : {};

export const addPosition = async (position: {
  symbol: string;
  type: TradeType;
  symbolName: string;
  qty: number;
  purchasePrice: number;
}) => {
  const symbol = position.symbol.toUpperCase();
  if (!positions[symbol]) {
    positions[symbol] = {
      symbol: symbol,
      symbolName: position.symbolName,
      qty: 0,
      purchasePrice: position.purchasePrice,
    } as Position;
  }

  positions[symbol].purchasePrice =
    (positions[symbol].qty * positions[symbol].purchasePrice +
      position.qty * position.purchasePrice) /
    (positions[symbol].qty + position.qty);
  positions[symbol].qty += position.qty;

  Cookies.set("trade_positions", JSON.stringify(positions));

  Msg.emit("position_added", { ...positions[symbol] });
  Msg.emit("positions_changed", positions);
};

export const removePosition = (position: {
  symbol: string;
  type: TradeType;
  qty: number;
  price: number;
}) => {
  const symbol = position.symbol.toUpperCase();

  if (!positions[symbol]) throw new Error("symbol not found");
  if (positions[symbol].qty - position.qty < 0)
    throw new Error(
      `Cannot remove more than current position (${symbol}) quantity`
    );

  positions[symbol].qty -= position.qty;

  Msg.emit("position_removed", { ...positions[symbol] });

  if (positions[symbol].qty === 0) delete positions[symbol];

  Cookies.set("trade_positions", JSON.stringify(positions));
  Msg.emit("positions_changed", positions);
};
