import { useCallback, useRef } from 'react';

export const useDebounce = () => {
  const schedule = useRef<NodeJS.Timeout>(false as any);

  return useCallback(
    <T extends (...args: any[]) => void>(callback: T, delay: number) =>
      (...args: Parameters<T>) => {
        clearTimeout(schedule.current);
        schedule.current = setTimeout(() => callback(...args), delay);
      },
    [],
  );
};
