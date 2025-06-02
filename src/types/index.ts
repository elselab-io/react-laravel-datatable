// Laravel pagination response structure
export interface LaravelPaginationResponse<T = any> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// DataTable configuration
export interface DataTableConfig {
  apiUrl: string;
  perPage?: number;
  searchable?: boolean;
  sortable?: boolean;
  className?: string;
  loadingText?: string;
  noDataText?: string;
  searchPlaceholder?: string;
}

// Column definition
export interface ColumnDefinition<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => any;
  className?: string;
}

// DataTable props
export interface DataTableProps<T = any> {
  columns: ColumnDefinition<T>[];
  config: DataTableConfig;
  onRowClick?: (row: T) => void;
  className?: string;
  paginationClassName?: string;
  tableClassName?: string;
}

// Pagination component props
export interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

// Sort configuration
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// API request parameters
export interface ApiRequestParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  [key: string]: any;
}
