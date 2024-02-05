import { fromNow } from "@/lib/utils";
import { useEffect, useState } from "react";

export const TimeAgo = ({ timestamp }: { timestamp: number }) => {
  const [timeAgo, setTimeAgo] = useState<string>(fromNow(timestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeAgo = fromNow(timestamp);
      if (newTimeAgo === timeAgo) return;
      setTimeAgo(fromNow(timestamp));
    }, 1000);

    return () => clearInterval(interval);
  });

  return <time className="text-xs">{timeAgo}</time>;
};
