/**
 * Format ABN to standard display format: "11 222 333 444"
 * @param abn - The ABN string (with or without spaces)
 * @returns Formatted ABN string
 */
export function formatABN(abn: string | undefined | null): string {
  if (!abn) return '';
  
  // Remove all non-digit characters
  const digits = abn.replace(/\D/g, '');
  
  // Ensure it's 11 digits
  if (digits.length !== 11) {
    return abn; // Return original if not valid ABN length
  }
  
  // Format as "11 222 333 444"
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
}