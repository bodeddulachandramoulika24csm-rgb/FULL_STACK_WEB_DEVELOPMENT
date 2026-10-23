import { useEffect, useState } from "react";

// Works like useState, but keeps the value in the browser's localStorage
// so cart, loans and orders survive a page refresh.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage may be full or blocked; the app still works in memory */
    }
  }, [key, value]);

  return [value, setValue];
}
