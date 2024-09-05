import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook que aplica un retraso a una función antes de ejecutarla.
 * @param func - La función que deseas debounciar.
 * @param delay - El tiempo de retraso en milisegundos.
 * @returns La función debounced.
 */
function useDebounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }, [func, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFunction;
}

export default useDebounce;