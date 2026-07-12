import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Extracts a backend error message from an axios-shaped catch(e), falling back to a default. */
export function getErrorMessage(e: unknown, fallback: string): string {
  if (e instanceof Error) {
    const withResponse = e as Error & { response?: { data?: { message?: string } } };
    return withResponse.response?.data?.message || e.message || fallback;
  }
  return fallback;
}
