import { useState } from "react";

export function useGlobalLoading(delay = 1000) {
  const [loading, setLoading] = useState(true);

  useState(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  });

  return loading;
}
