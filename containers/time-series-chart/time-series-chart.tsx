import React from "react";
import useSWR from "swr";
import { TimeSeriesChart as TimeSeriesChartComponent } from "@my-scope/ui.time-series-chart";

const ALPHA_VANTAGE_KEY = "21DYI4VFDQ2A33JH";

export type TimeSeriesChartKType = "DAILY" | "WEEKLY" | "MONTHLY";

interface SeriesData {
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

interface TimeSeriesChartProps {
  kType: TimeSeriesChartKType;
  symbol: string;
}

const getTimeSeriesUrl = (
  kType: TimeSeriesChartKType,
  symbol: string,
  intervalMins?: number,
  sliceYear?: number,
  sliceMonth?: number
) => {
  return `https://www.alphavantage.co/query?function=TIME_SERIES_${kType}&symbol=${symbol}${
    intervalMins ? `&interval=${intervalMins}min` : ""
  }${
    sliceYear && sliceMonth ? `&year${sliceYear}month${sliceMonth}` : ""
  }&apikey=${ALPHA_VANTAGE_KEY}`;
};

const useTimeSeriesData = (kType, symbol) => {
  return useSWR<SeriesResult>(getTimeSeriesUrl(kType, symbol), async (url) => {
    return fetch(url)
      .then((response) => response.body.getReader())
      .then((reader) => {
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                // When no more data needs to be consumed, close the stream
                if (done) {
                  controller.close();
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
              });
            }
          },
        });
      })
      .then((stream) => new Response(stream))
      .then(async (response) =>
        JSON.parse(await (await response.blob()).text())
      )
      .then((json) => {
        const seriesRaw =
          json[Object.keys(json).find((j) => /Time Series/.test(j))];

        return {
          meta: {
            info: json["Meta Data"]["1. Information"],
            symbol: json["Meta Data"]["2. Symbol"],
            lastRefreshed: json["Meta Data"]["3. Last Refreshed"],
            outputSize: json["Meta Data"]["4. Output Size"],
            timeZone: json["Meta Data"]["5. Time Zone"],
          },
          series: Object.keys(seriesRaw).reduce<Series>((obj, dateTime) => {
            obj[dateTime] = {
              open: parseInt(seriesRaw[dateTime]["1. open"], 10),
              high: parseInt(seriesRaw[dateTime]["2. high"], 10),
              low: parseInt(seriesRaw[dateTime]["3. low"], 10),
              close: parseInt(seriesRaw[dateTime]["4. close"], 10),
              volume: parseInt(seriesRaw[dateTime]["5. volume"], 10),
            };
            return obj;
          }, {}),
        } as SeriesResult;
      });
  });
};

export const TimeSeriesChart = ({ kType, symbol }: TimeSeriesChartProps) => {
  const { data } = useTimeSeriesData(kType, symbol);

  return <TimeSeriesChartComponent series={data?.series} meta={data?.meta} />;
};
