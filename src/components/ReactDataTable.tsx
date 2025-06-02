import React, { useState } from 'react';
import { useLaravelDataTable, UseLaravelDataTableOptions } from '../hooks/useLaravelDataTable';
import { Pagination } from './Pagination';
import { LoadingSpinner, TableSkeleton, SearchSkeleton, PaginationSkeleton, LoadingOverlay } from './LoadingSpinner';

export interface Column<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

export interface ReactDataTableProps<T = any> {
  apiUrl: string;
  columns: Column<T>[];
  initialPerPage?: number;
  initialFilters?: Record<string, any>;
  searchable?: boolean;
  searchPlaceholder?: string;
  showPerPageSelector?: boolean;
  perPageOptions?: number[];
  className?: string;
  tableClassName?: string;
  loadingText?: string;
  noDataText?: string;
  errorText?: string;
  onRowClick?: (row: T) => void;
  renderFilters?: (filters: Record<string, any>, setFilters: (filters: Record<string, any>) => void) => React.ReactNode;
}

export function ReactDataTable<T = any>({
  apiUrl,
  columns,
  initialPerPage = 15,
  initialFilters = {},
  searchable = true,
  searchPlaceholder = 'Search...',
  showPerPageSelector = true,
  perPageOptions = [10, 15, 25, 50, 100],
  className = '',
  tableClassName = '',
  loadingText = 'Loading...',
  noDataText = 'No data available',
  errorText = 'Error loading data',
  onRowClick,
  renderFilters,
}: ReactDataTableProps<T>) {
  const [searchInput, setSearchInput] = useState('');
  
  const {
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
  } = useLaravelDataTable<T>({
    apiUrl,
    initialPerPage,
    initialFilters,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleSort = (key: string) => {
    setSort(key);
  };

  const getSortIcon = (columnKey: string) => {
    if (sortBy !== columnKey) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
  };

  // Show skeleton loading only for initial load (when no data exists yet)
  const isInitialLoad = loading && data.length === 0 && !pagination;
  
  if (isInitialLoad) {
    return (
      <div className={`react-datatable ${className}`}>
        <SearchSkeleton />
        {renderFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-10 bg-gray-200 rounded-md"></div>
              <div className="h-10 bg-gray-200 rounded-md"></div>
              <div className="h-10 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        )}
        <TableSkeleton rows={initialPerPage} columns={columns.length} />
        <PaginationSkeleton />
      </div>
    );
  }

  return (
    <div className={`react-datatable ${className} relative`}>
      {/* Loading overlay for subsequent loads */}
      <LoadingOverlay 
        isVisible={loading && data.length > 0} 
        message="Updating data..." 
      />
      
      {/* Search and Filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {searchable && (
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={searchPlaceholder}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setSearch('');
                  }}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Clear
                </button>
              )}
            </form>
          )}

          {showPerPageSelector && (
            <div className="flex items-center gap-2">
              <label htmlFor="perPage" className="text-sm font-medium text-gray-700">
                Show:
              </label>
              <select
                id="perPage"
                value={pagination?.perPage || initialPerPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" className="text-white" />}
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Custom Filters */}
      {renderFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          {renderFilters(filters, setFilters)}
        </div>
      )}

      {/* Data Info */}
      {pagination && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {pagination.from} to {pagination.to} of {pagination.total} entries
          {search && ` (filtered from total entries)`}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{errorText}: {error}</p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className={`min-w-full ${tableClassName}`}>
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.className || ''}`}
                  onClick={() => column.sortable !== false && handleSort(String(column.key))}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable !== false && (
                      <span className="text-gray-400">{getSortIcon(String(column.key))}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && data.length === 0 ? (
              // Show skeleton rows when loading and no existing data
              Array.from({ length: Math.min(initialPerPage, 5) }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  {noDataText}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => {
                    const value = row[column.key];
                    const displayValue = column.render 
                      ? column.render(value, row)
                      : formatValue(value);

                    return (
                      <td
                        key={String(column.key)}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.lastPage > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            onPageChange={setPage}
            showFirstLast={true}
            showPrevNext={true}
            maxVisiblePages={5}
          />
        </div>
      )}
    </div>
  );
}
