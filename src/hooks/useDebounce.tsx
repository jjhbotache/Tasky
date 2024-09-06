import { useEffect, useCallback, useRef } from 'react'; 

/**
 * Hook that applies a delay to a function before executing it.
 * @param func - The function you want to debounce.
 * @param delay - The delay time in milliseconds.
 * @returns The debounced function.
 */
function useDebounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Reference to store the timeout ID

  // Memoized function that debounces the input function
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