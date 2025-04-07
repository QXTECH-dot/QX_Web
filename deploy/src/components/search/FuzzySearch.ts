/**
 * Calculates the Levenshtein distance (edit distance) between two strings
 * This measures how many character operations (insertions, deletions, substitutions)
 * it takes to transform one string into another
 */
export function levenshteinDistance(a: string, b: string): number {
  const distanceMatrix: number[][] = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null));

  // Fill the first row and column of the matrix
  for (let i = 0; i <= a.length; i += 1) {
    distanceMatrix[0][i] = i;
  }

  for (let j = 0; j <= b.length; j += 1) {
    distanceMatrix[j][0] = j;
  }

  // Fill in the rest of the matrix
  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      distanceMatrix[j][i] = Math.min(
        distanceMatrix[j][i - 1] + 1, // deletion
        distanceMatrix[j - 1][i] + 1, // insertion
        distanceMatrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return distanceMatrix[b.length][a.length];
}

/**
 * Calculates similarity score between two strings
 * Returns a value between 0 and 1, where 1 means identical
 */
export function stringSimilarity(str1: string, str2: string): number {
  if (!str1.length && !str2.length) return 1; // Both empty strings are identical
  if (!str1.length || !str2.length) return 0; // One empty string means no similarity

  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);

  // Normalize the distance to get a similarity score between 0 and 1
  return 1 - distance / maxLength;
}

/**
 * Performs a fuzzy search on an array of strings
 * Returns matches ranked by similarity
 */
export function fuzzySearch(query: string, items: string[], threshold = 0.6): string[] {
  if (!query || query.trim() === '') return [];

  const normalizedQuery = query.trim().toLowerCase();

  // Get similarity scores for each item
  const scoredItems = items.map(item => ({
    item,
    score: stringSimilarity(normalizedQuery, item.toLowerCase())
  }));

  // Filter by threshold and sort by score (highest first)
  return scoredItems
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

/**
 * Performs a fuzzy match on a single string
 * Returns true if the strings match with at least the given threshold
 */
export function fuzzyMatch(text: string, pattern: string, threshold = 0.7): boolean {
  if (!pattern || pattern.trim() === '') return true;
  if (!text) return false;

  const similarity = stringSimilarity(text.toLowerCase(), pattern.toLowerCase());
  return similarity >= threshold;
}

/**
 * Highlights matched characters in a string for search results
 */
export function highlightMatch(text: string, query: string): string {
  if (!query || query.trim() === '') return text;

  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase().trim();

  // For exact substring matches
  const index = normalizedText.indexOf(normalizedQuery);
  if (index >= 0) {
    const before = text.substring(0, index);
    const match = text.substring(index, index + normalizedQuery.length);
    const after = text.substring(index + normalizedQuery.length);
    return `${before}<strong>${match}</strong>${after}`;
  }

  // For fuzzy matches, we'll just return the original text
  // since highlighting specific characters is more complex
  return text;
}
