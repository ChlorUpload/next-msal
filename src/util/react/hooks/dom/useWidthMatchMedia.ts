import { useMatchMedia } from './useMatchMedia';

export function useWidthMatchMedia(minWidth: number) {
  return useMatchMedia(`(min-width: ${minWidth}px)`);
}
