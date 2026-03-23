import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Triggers a haptic feedback (vibration) if supported.
 * Optionally shows a debug toast for testing on non-supporting devices.
 */
export function triggerHaptic(duration: number = 20, debug: boolean = false): void {
  const hasVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  
  if (hasVibrate) {
    navigator.vibrate(duration);
  }

  if (debug) {
    toast(`[Haptic] ${duration}ms ${!hasVibrate ? '(Unsupported)' : ''}`, {
      id: 'haptic-debug', // Prevent toast stacking
      duration: 1000,
    });
  }
}

/**
 * Returns a local date string in YYYY-MM-DD format.
 */
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date in local YYYY-MM-DD format.
 */
export function getLocalToday(): string {
  return formatLocalDate(new Date());
}

/**
 * Adds a specified number of days to a YYYY-MM-DD string.
 */
export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

/**
 * Subtracts a specified number of days from a YYYY-MM-DD string.
 */
export function subDays(dateStr: string, days: number): string {
  return addDays(dateStr, -days);
}
