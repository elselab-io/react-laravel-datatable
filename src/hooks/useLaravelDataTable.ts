import { useState, useEffect, useCallback } from 'react';
import { LaravelPaginationResponse, ApiRequestParams } from '../types';
import { fetchPaginatedData } from '../utils/api';

export interface UseLaravelDataTableOptions {
  apiUrl: string;
  initialPerPage?: number;
  initialFilters?: Record<string, any>;
  autoLoad?: boolean;
}

export interface UseLaravelDataTableReturn<T> {
  data: T[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  } | null;
  loading: boolean;
  error: string | null;
  search: string;
  sortBy: string | null;
  sortDirection: 'asc' | 'desc';
  filters: Record<string, any>;
  
  // Actions
  setSearch: (search: string) => void;
  setSort: (key: string, direction?: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setFilters: (filters: Record<string, any>) => void;
  refresh: () => void;
}

export function useLaravelDataTable<T = any>(
  options: UseLaravelDataTableOptions
): UseLaravelDataTableReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearchState] = useState('');
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPageState] = useState(options.initialPerPage || 15);
  const [filters, setFiltersState] = useState(options.initialFilters || {});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: ApiRequestParams = {
        page: currentPage,
        per_page: perPage,
        ...filters,
      };

      if (search) {
        params.search = search;
      }

      if (sortBy) {
        params.sort_by = sortBy;
        params.sort_direction = sortDirection;
      }

      const response = await fetch(`${options.apiUrl}?${new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle the custom API format
      if (result.status === 'success') {
        setData(result.data || []);
        
        if (result.pagination) {
          setPagination({
            currentPage: result.pagination.current_page,
            lastPage: result.pagination.last_page,
            perPage: result.pagination.per_page,
            total: result.pagination.total,
            from: result.pagination.from,
            to: result.pagination.to,
          });
        }
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [options.apiUrl, currentPage, perPage, search, sortBy, sortDirection, filters]);

  useEffect(() => {
    if (options.autoLoad !== false) {
      loadData();
    }
  }, [loadData, options.autoLoad]);

  const setSearch = useCallback((newSearch: string) => {
    setSearchState(newSearch);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const setSort = useCallback((key: string, direction?: 'asc' | 'desc') => {
    if (sortBy === key && !direction) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection(direction || 'asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  }, [sortBy]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const setPerPage = useCallback((newPerPage: number) => {
    setPerPageState(newPerPage);
    setCurrentPage(1); // Reset to first page when changing per page
  }, []);

  const setFilters = useCallback((newFilters: Record<string, any>) => {
    setFiltersState(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    pagination,
    loading,
    error,
    search,
    sortBy,
    sortDirection,
    filters,
    setSearch,
    setSort,
    setPage,
    setPerPage,
    setFilters,
    refresh,
  };
}
