import React, { useMemo, useState, useEffect } from "react";
import { Positions as PositionsComponent } from "@my-scope/ui.positions";
import { positions as servicePositions } from "@my-scope/services.positions";
import { Msg } from "@my-scope/utils.msg";

interface Position {
  symbol: string;
  symbolName: string;
  qty: number;
  purchasePrice: number;
}

const randomizeChange = (originalNumber: number, percentRange: number) => {
  return (
    (((Math.random() > 0.5 ? 1 : -1) * (Math.random() * percentRange)) / 100) *
    originalNumber
  );
};

export const Positions = () => {
  const [positions, setPositions] = useState(servicePositions);
  const netAssetAmt = 153829.21;
  const positionsMapped = useMemo(
    () =>
      Object.values(positions as { [symbol: string]: Position }).map(
        (p: Position) => {
          const currentPrice =
            p.purchasePrice + randomizeChange(p.purchasePrice, 18);
          const todayPL = randomizeChange(currentPrice, 6) * p.qty;
          const totalPL = currentPrice * p.qty - p.purchasePrice * p.qty;

          return {
            ...p,
            marketValue: currentPrice * p.qty,
            currentPrice,
            todayPL,
            totalPL,
            netPercent: ((currentPrice * p.qty) / netAssetAmt) * 100,
          };
        }
      ),
    [positions, netAssetAmt]
  );

  useEffect(() => {
    const positions_changedFn = (positions) => {
      setPositions({ ...positions });
    };
    Msg.on("positions_changed", positions_changedFn);

    return () => {
      Msg.remove("positions_changed", positions_changedFn);
    };
  }, []);

  const [sort, setSort] = useState({ sortBy: "symbol", sortAsc: true });

  return (
    <PositionsComponent
      positions={positionsMapped}
      sortBy={sort.sortBy}
      sortAsc={sort.sortAsc}
      onSortByClick={(sortBy) =>
        setSort({
          sortBy,
          sortAsc: sort.sortBy === sortBy ? !sort.sortAsc : true,
        })
      }
    />
  );
};
