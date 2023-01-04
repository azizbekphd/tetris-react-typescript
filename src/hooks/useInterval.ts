import React from "react";

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = React.useRef<() => void>();

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, []);
};

export default useInterval;
