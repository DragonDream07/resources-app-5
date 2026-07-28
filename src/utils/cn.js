import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names conditionally using clsx, then deduplicates and merges
 * conflicting Tailwind CSS utility classes using tailwind-merge.
 *
 * Usage:
 *   cn('px-4 py-2', isActive && 'bg-blue-500', 'bg-red-500')
 *   // => 'px-4 py-2 bg-red-500'  (bg-blue-500 and bg-red-500 merged; last wins)
 *
 * @param {...import('clsx').ClassValue} inputs - Any number of class name arguments
 *   accepted by clsx: strings, arrays, objects, undefined, null, etc.
 * @returns {string} A single deduplicated, merged class name string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default cn;
