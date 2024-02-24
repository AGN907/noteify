import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia === "undefined"
  ) {
    return false;
  }

  const mediaQuery = window.matchMedia(query);
  const [match, setMatch] = useState(!!mediaQuery.matches);

  useEffect(() => {
    const listener = () => setMatch(!!mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [match]);

  return match ? true : false;
};
