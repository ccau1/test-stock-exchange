import { useState } from "react";

export const useForceUpdate = () => {
  const [, setLastUpdate] = useState(new Date().valueOf());
  return () => {
    setLastUpdate(new Date().valueOf());
  };
};
