// Main exports
import { DataTable } from './components/DataTable';
export { DataTable };

// Type exports
export type {
  LaravelPaginationResponse,
  PaginationLink,
  DataTableConfig,
  ColumnDefinition,
  DataTableProps,
  PaginationProps,
  SortConfig,
  ApiRequestParams
} from './types';

// Utility exports
export {
  buildQueryString,
  fetchPaginatedData,
  extractPageFromUrl,
  generatePageNumbers
} from './utils/api';

// React components (optional - only if React is available)
export { Pagination } from './components/Pagination';
export { ReactDataTable } from './components/ReactDataTable';
export type { Column, ReactDataTableProps } from './components/ReactDataTable';
export { 
  LoadingSpinner, 
  TableSkeleton, 
  SearchSkeleton, 
  PaginationSkeleton, 
  LoadingOverlay 
} from './components/LoadingSpinner';
export type { 
  LoadingSpinnerProps, 
  TableSkeletonProps, 
  SearchSkeletonProps, 
  PaginationSkeletonProps, 
  LoadingOverlayProps 
} from './components/LoadingSpinner';

// React hooks
export { useLaravelDataTable } from './hooks/useLaravelDataTable';
export type { UseLaravelDataTableOptions, UseLaravelDataTableReturn } from './hooks/useLaravelDataTable';

// Default export for convenience
export default DataTable;
