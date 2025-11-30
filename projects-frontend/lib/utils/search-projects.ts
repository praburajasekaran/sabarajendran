/**
 * Project Search Utilities
 *
 * Advanced search and ranking algorithms for project discovery.
 * Implements fuzzy matching, relevance scoring, and search suggestions.
 *
 * WHY: Constituents need to quickly find specific projects.
 * Smart search with ranking ensures most relevant results appear first.
 */

import type { Project } from "@/lib/wordpress/types";

/**
 * Search result with relevance score
 */
export interface SearchResult {
  project: Project;
  score: number;
  matchedFields: string[];
}

/**
 * Search projects with advanced relevance ranking
 *
 * @param projects - Projects to search
 * @param query - Search query
 * @param options - Search options
 * @returns Array of search results sorted by relevance
 *
 * @example
 * ```ts
 * const results = searchProjects(projects, 'road construction');
 * results.forEach(result => {
 *   console.log(`${result.project.title} (score: ${result.score})`);
 *   console.log(`Matched in: ${result.matchedFields.join(', ')}`);
 * });
 * ```
 */
export function searchProjects(
  projects: Project[],
  query: string,
  options: {
    /** Minimum score to include in results (0-100) */
    minScore?: number;
    /** Maximum results to return */
    maxResults?: number;
    /** Fields to search in */
    fields?: Array<"title" | "excerpt" | "content" | "categories" | "villages">;
  } = {}
): SearchResult[] {
  const {
    minScore = 0,
    maxResults = Infinity,
    fields = ["title", "excerpt", "content", "categories", "villages"],
  } = options;

  if (!query.trim()) {
    return projects.map((project) => ({
      project,
      score: 0,
      matchedFields: [],
    }));
  }

  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase().trim();
  const queryTerms = queryLower.split(/\s+/);

  projects.forEach((project) => {
    let score = 0;
    const matchedFields: string[] = [];

    // Title matching (highest weight)
    if (fields.includes("title")) {
      const titleLower = project.title.toLowerCase();
      if (titleLower === queryLower) {
        score += 100;
        matchedFields.push("title (exact)");
      } else if (titleLower.includes(queryLower)) {
        score += 50;
        matchedFields.push("title");
      } else {
        // Check for individual term matches
        const termMatches = queryTerms.filter((term) => titleLower.includes(term));
        if (termMatches.length > 0) {
          score += 30 * (termMatches.length / queryTerms.length);
          matchedFields.push("title (partial)");
        }
      }
    }

    // Excerpt matching (medium weight)
    if (fields.includes("excerpt")) {
      const excerptLower = project.excerpt.toLowerCase();
      if (excerptLower.includes(queryLower)) {
        score += 30;
        matchedFields.push("excerpt");
      } else {
        const termMatches = queryTerms.filter((term) => excerptLower.includes(term));
        if (termMatches.length > 0) {
          score += 15 * (termMatches.length / queryTerms.length);
          matchedFields.push("excerpt (partial)");
        }
      }
    }

    // Content matching (lower weight)
    if (fields.includes("content")) {
      const contentLower = project.content.toLowerCase();
      if (contentLower.includes(queryLower)) {
        score += 10;
        matchedFields.push("content");
      } else {
        const termMatches = queryTerms.filter((term) => contentLower.includes(term));
        if (termMatches.length > 0) {
          score += 5 * (termMatches.length / queryTerms.length);
        }
      }
    }

    // Category matching
    if (fields.includes("categories")) {
      const categoryMatch = project.categories.some(
        (cat) => cat.name.toLowerCase().includes(queryLower)
      );
      if (categoryMatch) {
        score += 25;
        matchedFields.push("category");
      }
    }

    // Village matching
    if (fields.includes("villages")) {
      const villageMatch = project.villages.some(
        (village) => village.name.toLowerCase().includes(queryLower)
      );
      if (villageMatch) {
        score += 25;
        matchedFields.push("village");
      }
    }

    // Year matching
    const yearMatch = project.years.some(
      (year) => year.name.toLowerCase().includes(queryLower)
    );
    if (yearMatch) {
      score += 15;
      matchedFields.push("year");
    }

    // Status matching
    const statusMatch = project.statuses.some(
      (status) => status.name.toLowerCase().includes(queryLower)
    );
    if (statusMatch) {
      score += 15;
      matchedFields.push("status");
    }

    // Only include results above minimum score
    if (score >= minScore) {
      results.push({ project, score, matchedFields });
    }
  });

  // Sort by score (highest first)
  results.sort((a, b) => b.score - a.score);

  // Limit results
  return results.slice(0, maxResults);
}

/**
 * Highlight search terms in text
 *
 * @param text - Text to highlight
 * @param query - Search query
 * @returns HTML string with <mark> tags around matches
 *
 * @example
 * ```ts
 * highlightMatches('Road Construction Project', 'road');
 * // Returns: '<mark>Road</mark> Construction Project'
 * ```
 */
export function highlightMatches(text: string, query: string): string {
  if (!query.trim()) return text;

  const queryLower = query.toLowerCase();
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Generate search suggestions based on popular terms
 *
 * @param projects - All projects
 * @param query - Current search query
 * @param maxSuggestions - Maximum suggestions to return
 * @returns Array of suggested search terms
 *
 * @example
 * ```ts
 * getSuggestions(projects, 'roa');
 * // Returns: ['road', 'road construction', 'road development']
 * ```
 */
export function getSuggestions(
  projects: Project[],
  query: string,
  maxSuggestions: number = 5
): string[] {
  if (!query.trim() || query.length < 2) return [];

  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();

  // Extract words from titles that start with the query
  projects.forEach((project) => {
    const words = project.title.toLowerCase().split(/\s+/);
    words.forEach((word) => {
      if (word.startsWith(queryLower) && word.length > query.length) {
        suggestions.add(word);
      }
    });

    // Also check full title
    if (project.title.toLowerCase().includes(queryLower)) {
      suggestions.add(project.title);
    }
  });

  // Convert to array and sort by length (shorter suggestions first)
  return Array.from(suggestions)
    .sort((a, b) => a.length - b.length)
    .slice(0, maxSuggestions);
}

/**
 * Get popular search terms based on project data
 *
 * @param projects - All projects
 * @returns Array of popular search terms with counts
 */
export function getPopularSearchTerms(
  projects: Project[]
): Array<{ term: string; count: number }> {
  const termCounts = new Map<string, number>();

  projects.forEach((project) => {
    // Extract significant words from title (excluding common words)
    const words = project.title
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3) // Exclude short words
      .filter((word) => !isCommonWord(word)); // Exclude common words

    words.forEach((word) => {
      termCounts.set(word, (termCounts.get(word) || 0) + 1);
    });
  });

  return Array.from(termCounts.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

/**
 * Check if a word is a common word (should be excluded from suggestions)
 */
const COMMON_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "this",
  "that",
  "these",
  "those",
  "project",
  "work",
  "development",
]);

function isCommonWord(word: string): boolean {
  return COMMON_WORDS.has(word.toLowerCase());
}

/**
 * Debounce helper for search input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
