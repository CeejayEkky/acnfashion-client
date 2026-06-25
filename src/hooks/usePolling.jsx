// frontend/src/hooks/usePolling.js
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const usePolling = (fetchAction, interval = 5000, dataSelector, getNewItems = null) => {
  const prevCountRef = useRef(0);
  const firstRunRef = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchAction();
      if (result?.payload) {
        const items = dataSelector(result.payload);
        const currentCount = items?.length || 0;
        if (!firstRunRef.current && currentCount > prevCountRef.current) {
          const newCount = currentCount - prevCountRef.current;
          toast.info(`🔄 ${newCount} new ${getNewItems ? getNewItems() : 'items'} added!`);
        }
        prevCountRef.current = currentCount;
        firstRunRef.current = false;
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling
    const intervalId = setInterval(fetchData, interval);
    return () => clearInterval(intervalId);
  }, [fetchAction, interval, dataSelector, getNewItems]);
};