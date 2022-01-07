import { Msg } from "@my-scope/utils.msg";
import Cookies from "js-cookie";

const ALPHA_VANTAGE_KEY = "21DYI4VFDQ2A33JH";

export interface SymbolQuote {
  symbol: string;
  open: number;
  high: number;
  low: number;
  price: number;
  volume: number;
  latestTradingDay: string;
  previousClose: number;
  change: number;
  changePercent: number;
  lastUpdated: number;
}

interface SeriesData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Series {
  [dateTime: string]: SeriesData;
}

interface SeriesMeta {
  info: string;
  symbol: string;
  lastRefreshed: string;
  outputSize: string;
  timeZone: string;
}

interface SeriesResult {
  meta: SeriesMeta;
  series: Series;
}

export type TimeSeriesChartKType = "DAILY" | "WEEKLY" | "MONTHLY";

let fetchedQuotes: { [symbol: string]: SymbolQuote } = {};

let currentSymbol = Cookies.get("trading_current_symbol")
  ? Cookies.get("trading_current_symbol")
  : "TSLA";

let currentQuote: SymbolQuote = null;

export const getCurrentSymbol = () => {
  return currentSymbol;
};

export const getCurrentQuote = () => currentQuote;

export const orderBookBuys = [];

export const orderBookSells = [];

export const getTimeSeriesUrl = (
  kType: TimeSeriesChartKType,
  symbol: string,
  intervalMins?: number,
  sliceYear?: number,
  sliceMonth?: number
) => {
  return `https://www.alphavantage.co/query?function=TIME_SERIES_${kType}&outputsize=full&symbol=${symbol}${
    intervalMins ? `&interval=${intervalMins}min` : ""
  }${
    sliceYear && sliceMonth ? `&year${sliceYear}month${sliceMonth}` : ""
  }&apikey=${ALPHA_VANTAGE_KEY}`;
};

const timeSeriesCache = {};

const ONE_HOUR = 1000 * 60 * 60;

const TIME_SERIES_CACHE_TIME_LIMIT = 24 * ONE_HOUR;

export const getTimeSeriesData = async ({
  symbol,
  kType,
}: {
  symbol: string;
  kType: TimeSeriesChartKType;
}) => {
  const identifier = `${symbol}_${kType}`;
  if (
    new Date().valueOf() - (timeSeriesCache[identifier]?.lastFetched || 0) <
    TIME_SERIES_CACHE_TIME_LIMIT
  ) {
    return timeSeriesCache[identifier];
  }

  const data = await (await fetch(getTimeSeriesUrl(kType, symbol))).json();

  const seriesRaw = data[Object.keys(data).find((j) => /Time Series/.test(j))];

  timeSeriesCache[identifier] = {
    lastFetched: new Date().valueOf(),
    meta: {
      info: data["Meta Data"]["1. Information"],
      symbol: data["Meta Data"]["2. Symbol"],
      lastRefreshed: data["Meta Data"]["3. Last Refreshed"],
      outputSize: data["Meta Data"]["4. Output Size"],
      timeZone: data["Meta Data"]["5. Time Zone"],
    },
    series: Object.keys(seriesRaw)
      .sort((a, b) => a.localeCompare(b))
      .map((dateTime) => ({
        time: dateTime,
        open: parseInt(seriesRaw[dateTime]["1. open"], 10),
        high: parseInt(seriesRaw[dateTime]["2. high"], 10),
        low: parseInt(seriesRaw[dateTime]["3. low"], 10),
        close: parseInt(seriesRaw[dateTime]["4. close"], 10),
        volume: parseInt(seriesRaw[dateTime]["5. volume"], 10),
      })),
  };

  return timeSeriesCache[identifier];
};

export const getQuoteBySymbol = async (
  _symbol: string
): Promise<SymbolQuote> => {
  const symbol = _symbol.toUpperCase();
  if (
    new Date().valueOf() - (fetchedQuotes[symbol]?.lastUpdated || 0) <
    1000 * 10
  ) {
    return fetchedQuotes[symbol];
  }

  const symbolQuote = await (
    await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
    )
  ).json();

  if (!symbolQuote["Global Quote"]?.["01. symbol"])
    throw new Error("invalid symbol");

  fetchedQuotes[symbol] = {
    lastUpdated: new Date().valueOf(),
    symbol: symbolQuote["Global Quote"]["01. symbol"],
    open: parseFloat(symbolQuote["Global Quote"]["02. open"]),
    high: parseFloat(symbolQuote["Global Quote"]["03. high"]),
    low: parseFloat(symbolQuote["Global Quote"]["04. low"]),
    price: parseFloat(symbolQuote["Global Quote"]["05. price"]),
    volume: parseFloat(symbolQuote["Global Quote"]["06. volume"]),
    latestTradingDay: symbolQuote["Global Quote"]["07. latest trading day"],
    previousClose: parseFloat(
      symbolQuote["Global Quote"]["08. previous close"]
    ),
    change: parseFloat(symbolQuote["Global Quote"]["09. change"]),
    changePercent: parseFloat(
      symbolQuote["Global Quote"]["10. change percent"]
    ),
  };

  return fetchedQuotes[symbol];
};

export const setCurrentSymbol = async (symbol: string) => {
  // get symbol quote
  let symbolQuoteRes = null;
  try {
    symbolQuoteRes = await getQuoteBySymbol(symbol);
  } catch (err) {
    Msg.emit("error_setSymbol", err);
    return;
  }
  // store current symbol
  Cookies.set("currentSymbol", symbol);
  // fetch order book for this symbol
  fetchOrderBook(symbol);
  // store symbol quote
  currentQuote = symbolQuoteRes;

  // emit symbol complete
  Msg.emit("symbol_changed", { symbol, symbolQuote: currentQuote });
};

const generateOrderBookOrders = ({
  length,
  basePrice,
  isSell,
}: {
  length: number;
  basePrice: number;
  isSell: boolean;
}) => {
  let price, amt, total;
  return Array.from({ length }).map(() => {
    price = basePrice + (isSell ? -1 : 1) * (Math.random() * 2);
    amt = Math.floor(
      Math.random() * 200 + (Math.random() < 0.2 ? Math.random() * 3000 : 0)
    );
    total = price * amt;
    return { price, amt, total };
  });
};

const fetchOrderBook = async (symbol: string) => {
  const quote = await getQuoteBySymbol(symbol);
  // generate order book data
  orderBookBuys.splice(0);
  orderBookSells.splice(0);
  orderBookBuys.push(
    ...generateOrderBookOrders({
      length: 30,
      basePrice: quote.price,
      isSell: false,
    })
  );
  orderBookSells.push(
    ...generateOrderBookOrders({
      length: 30,
      basePrice: quote.price,
      isSell: true,
    })
  );
};

// init initial quote
setCurrentSymbol(currentSymbol);

// simulate socket incomings
const orderBookChangeInterval = () => {
  // randomize is sell or buy
  const isSell = Math.random() > 0.5;
  const list = isSell ? orderBookSells : orderBookBuys;
  // if list has more than 20 items, randomize is remove
  // if less less than 20 items, must add
  let isRemove = Math.random() > 0.5;
  // isRemove override if it goes out of range
  if (list.length > 30) {
    isRemove = true;
  } else if (list.length < 30) {
    isRemove = false;
  }

  if (isRemove) {
    const indexToRemove = Math.floor(
      Math.random() * (isSell ? orderBookSells.length : orderBookBuys.length)
    );
    // if remove, emit it
    Msg.emit("orderBook_remove", {
      isSell,
      index: indexToRemove,
    });
    if (isSell) orderBookSells.splice(indexToRemove, 1);
    else orderBookBuys.splice(indexToRemove, 1);
  } else {
    const newOrders = generateOrderBookOrders({
      length: 1,
      basePrice: currentQuote?.price || 0,
      isSell,
    });
    // if add, generate new ones now
    Msg.emit("orderBook_add", {
      isSell,
      orders: newOrders,
    });

    const arr = isSell ? orderBookSells : orderBookBuys;
    newOrders.forEach((o) => {
      arr.splice(Math.floor(Math.random() * (arr.length - 1)), 0, o);
    });
  }

  Msg.emit("orderBook_change", { isSell, orderBookBuys, orderBookSells });

  setTimeout(orderBookChangeInterval, Math.random() * 1000);
};
orderBookChangeInterval();
