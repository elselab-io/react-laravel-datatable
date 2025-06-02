import { 
  LaravelPaginationResponse, 
  DataTableConfig, 
  ColumnDefinition, 
  SortConfig, 
  ApiRequestParams 
} from '../types';
import { fetchPaginatedData, generatePageNumbers } from '../utils/api';

export class DataTable<T = any> {
  private container: HTMLElement;
  private config: DataTableConfig;
  private columns: ColumnDefinition<T>[];
  private data: LaravelPaginationResponse<T> | null = null;
  private currentSort: SortConfig | null = null;
  private currentSearch: string = '';
  private currentPage: number = 1;
  private loading: boolean = false;

  constructor(
    container: HTMLElement | string,
    columns: ColumnDefinition<T>[],
    config: DataTableConfig
  ) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) as HTMLElement
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }

    this.columns = columns;
    this.config = {
      perPage: 10,
      searchable: true,
      sortable: true,
      loadingText: 'Loading...',
      noDataText: 'No data available',
      searchPlaceholder: 'Search...',
      ...config
    };

    this.init();
  }

  private init(): void {
    this.container.className = `datatable-container ${this.config.className || ''}`;
    this.render();
    this.loadData();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="datatable-wrapper">
        ${this.config.searchable ? this.renderSearchBox() : ''}
        <div class="datatable-content">
          ${this.renderTable()}
        </div>
        <div class="datatable-pagination"></div>
      </div>
    `;

    this.attachEventListeners();
  }

  private renderSearchBox(): string {
    return `
      <div class="mb-4">
        <input
          type="text"
          placeholder="${this.config.searchPlaceholder}"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          data-search-input
        />
      </div>
    `;
  }

  private renderTable(): string {
    if (this.loading) {
      return `<div class="text-center py-8">${this.config.loadingText}</div>`;
    }

    if (!this.data || this.data.data.length === 0) {
      return `<div class="text-center py-8">${this.config.noDataText}</div>`;
    }

    return `
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead class="bg-gray-50">
            <tr>
              ${this.columns.map(column => this.renderHeaderCell(column)).join('')}
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            ${this.data.data.map(row => this.renderRow(row)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderHeaderCell(column: ColumnDefinition<T>): string {
    const sortable = this.config.sortable && column.sortable !== false;
    const isSorted = this.currentSort?.key === column.key;
    const sortDirection = isSorted ? this.currentSort!.direction : null;
    
    const sortIcon = sortable ? (
      isSorted 
        ? (sortDirection === 'asc' ? '↑' : '↓')
        : '↕'
    ) : '';

    return `
      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''} ${sortable ? 'cursor-pointer hover:bg-gray-100' : ''}"
          ${sortable ? `data-sort-key="${String(column.key)}"` : ''}>
        <div class="flex items-center space-x-1">
          <span>${column.label}</span>
          ${sortIcon ? `<span class="text-gray-400">${sortIcon}</span>` : ''}
        </div>
      </th>
    `;
  }

  private renderRow(row: T): string {
    return `
      <tr class="hover:bg-gray-50">
        ${this.columns.map(column => this.renderCell(column, row)).join('')}
      </tr>
    `;
  }

  private renderCell(column: ColumnDefinition<T>, row: T): string {
    const value = row[column.key];
    const displayValue = column.render 
      ? column.render(value, row)
      : String(value || '');

    return `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}">
        ${displayValue}
      </td>
    `;
  }

  private renderPagination(): void {
    const paginationContainer = this.container.querySelector('.datatable-pagination') as HTMLElement;
    
    if (!this.data || this.data.last_page <= 1) {
      paginationContainer.innerHTML = '';
      return;
    }

    const pageNumbers = generatePageNumbers(this.data.current_page, this.data.last_page, 5);
    const showStartEllipsis = pageNumbers[0] > 1;
    const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < this.data.last_page;

    paginationContainer.innerHTML = `
      <nav class="flex items-center justify-center space-x-1 mt-4" aria-label="Pagination">
        ${this.data.current_page > 1 ? `
          <button class="pagination-btn" data-page="1" aria-label="Go to first page">««</button>
        ` : ''}
        
        <button class="pagination-btn ${this.data.current_page <= 1 ? 'disabled' : ''}" 
                data-page="${this.data.current_page - 1}" 
                ${this.data.current_page <= 1 ? 'disabled' : ''}
                aria-label="Go to previous page">‹</button>

        ${showStartEllipsis ? `
          <button class="pagination-btn" data-page="1">1</button>
          <span class="px-3 py-2 text-sm font-medium text-gray-500">...</span>
        ` : ''}

        ${pageNumbers.map(page => `
          <button class="pagination-btn ${page === this.data!.current_page ? 'active' : ''}" 
                  data-page="${page}" 
                  aria-label="Go to page ${page}"
                  ${page === this.data!.current_page ? 'aria-current="page"' : ''}>
            ${page}
          </button>
        `).join('')}

        ${showEndEllipsis ? `
          <span class="px-3 py-2 text-sm font-medium text-gray-500">...</span>
          <button class="pagination-btn" data-page="${this.data.last_page}">${this.data.last_page}</button>
        ` : ''}

        <button class="pagination-btn ${this.data.current_page >= this.data.last_page ? 'disabled' : ''}" 
                data-page="${this.data.current_page + 1}"
                ${this.data.current_page >= this.data.last_page ? 'disabled' : ''}
                aria-label="Go to next page">›</button>

        ${this.data.current_page < this.data.last_page ? `
          <button class="pagination-btn" data-page="${this.data.last_page}" aria-label="Go to last page">»»</button>
        ` : ''}
      </nav>
    `;

    // Add pagination styles
    this.addPaginationStyles();
  }

  private addPaginationStyles(): void {
    const styleId = 'datatable-pagination-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .pagination-btn {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #6b7280;
        background-color: white;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      .pagination-btn:hover:not(.disabled) {
        background-color: #f9fafb;
        color: #374151;
      }
      .pagination-btn.active {
        color: white;
        background-color: #2563eb;
        border-color: #2563eb;
      }
      .pagination-btn.active:hover {
        background-color: #1d4ed8;
      }
      .pagination-btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }

  private attachEventListeners(): void {
    // Search input
    const searchInput = this.container.querySelector('[data-search-input]') as HTMLInputElement;
    if (searchInput) {
      let searchTimeout: number;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = window.setTimeout(() => {
          this.currentSearch = (e.target as HTMLInputElement).value;
          this.currentPage = 1;
          this.loadData();
        }, 300);
      });
    }

    // Sort headers
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const sortKey = target.closest('[data-sort-key]')?.getAttribute('data-sort-key');
      
      if (sortKey) {
        this.handleSort(sortKey);
      }

      // Pagination buttons
      const pageButton = target.closest('[data-page]') as HTMLElement;
      if (pageButton && !pageButton.classList.contains('disabled')) {
        const page = parseInt(pageButton.getAttribute('data-page') || '1');
        this.goToPage(page);
      }
    });
  }

  private handleSort(key: string): void {
    if (this.currentSort?.key === key) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = { key, direction: 'asc' };
    }
    this.currentPage = 1;
    this.loadData();
  }

  private goToPage(page: number): void {
    if (page >= 1 && page <= (this.data?.last_page || 1) && page !== this.currentPage) {
      this.currentPage = page;
      this.loadData();
    }
  }

  private async loadData(): Promise<void> {
    this.loading = true;
    this.updateTable();

    try {
      const params: ApiRequestParams = {
        page: this.currentPage,
        per_page: this.config.perPage,
      };

      if (this.currentSearch) {
        params.search = this.currentSearch;
      }

      if (this.currentSort) {
        params.sort_by = this.currentSort.key;
        params.sort_direction = this.currentSort.direction;
      }

      this.data = await fetchPaginatedData<T>(this.config.apiUrl, params);
    } catch (error) {
      console.error('Failed to load data:', error);
      this.data = null;
    } finally {
      this.loading = false;
      this.updateTable();
      this.renderPagination();
    }
  }

  private updateTable(): void {
    const contentContainer = this.container.querySelector('.datatable-content') as HTMLElement;
    if (contentContainer) {
      contentContainer.innerHTML = this.renderTable();
    }
  }

  // Public methods
  public refresh(): void {
    this.loadData();
  }

  public search(query: string): void {
    this.currentSearch = query;
    this.currentPage = 1;
    const searchInput = this.container.querySelector('[data-search-input]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = query;
    }
    this.loadData();
  }

  public sort(key: string, direction: 'asc' | 'desc'): void {
    this.currentSort = { key, direction };
    this.currentPage = 1;
    this.loadData();
  }

  public getData(): LaravelPaginationResponse<T> | null {
    return this.data;
  }
}
