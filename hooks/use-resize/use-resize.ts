import { useRef, useState, useLayoutEffect } from "react";

export const useResize = (
  onResize?: (size: { width: number; height: number }) => void
) => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    setSize({
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight,
    });
    onResize?.({
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight,
    });
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (size.width === width || size.height === height) return;

      setSize({ width, height });
      onResize?.({ width, height });
    });

    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [ref.current, onResize]);

  return { ref, ...size };
};
