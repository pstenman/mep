import { useState, useEffect } from "react";

export function useDebouncedSearch(delay = 300) {
  const [rawSearch, setRawSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(rawSearch), delay);
    return () => clearTimeout(timer);
  }, [rawSearch, delay]);

  return {
    rawSearch,
    setRawSearch,
    debouncedSearch,
  };
}
