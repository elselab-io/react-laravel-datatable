import { LaravelPaginationResponse, ApiRequestParams } from '../types';

/**
 * Builds query string from API request parameters
 */
export function buildQueryString(params: ApiRequestParams): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

/**
 * Fetches paginated data from Laravel API
 */
export async function fetchPaginatedData<T>(
  baseUrl: string,
  params: ApiRequestParams = {}
): Promise<LaravelPaginationResponse<T>> {
  const queryString = buildQueryString(params);
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Extracts page number from Laravel pagination URL
 */
export function extractPageFromUrl(url: string | null): number | null {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    const page = urlObj.searchParams.get('page');
    return page ? parseInt(page, 10) : null;
  } catch {
    return null;
  }
}

/**
 * Generates page numbers array for pagination display
 */
export function generatePageNumbers(
  currentPage: number,
  lastPage: number,
  maxVisible: number = 5
): number[] {
  if (lastPage <= maxVisible) {
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  }
  
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(lastPage, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
