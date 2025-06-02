import React from 'react';
import { PaginationProps } from '../types';
import { generatePageNumbers } from '../utils/api';

const defaultClasses = {
  container: 'flex items-center justify-center space-x-1',
  button: 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
  activeButton: 'px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
  ellipsis: 'px-3 py-2 text-sm font-medium text-gray-500'
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = ''
}) => {
  if (lastPage <= 1) return null;

  const pageNumbers = generatePageNumbers(currentPage, lastPage, maxVisiblePages);
  const showStartEllipsis = pageNumbers[0] > 1;
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < lastPage;

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= lastPage && page !== currentPage) {
      onPageChange(page);
    }
  };

  const containerClass = className || defaultClasses.container;

  return (
    <nav className={containerClass} aria-label="Pagination">
      {/* First page button */}
      {showFirstLast && currentPage > 1 && (
        <button
          onClick={() => handlePageClick(1)}
          className={defaultClasses.button}
          aria-label="Go to first page"
        >
          ««
        </button>
      )}

      {/* Previous page button */}
      {showPrevNext && (
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1}
          className={defaultClasses.button}
          aria-label="Go to previous page"
        >
          ‹
        </button>
      )}

      {/* Start ellipsis */}
      {showStartEllipsis && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            className={defaultClasses.button}
          >
            1
          </button>
          <span className={defaultClasses.ellipsis}>...</span>
        </>
      )}

      {/* Page numbers */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={
            page === currentPage
              ? defaultClasses.activeButton
              : defaultClasses.button
          }
          aria-label={`Go to page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* End ellipsis */}
      {showEndEllipsis && (
        <>
          <span className={defaultClasses.ellipsis}>...</span>
          <button
            onClick={() => handlePageClick(lastPage)}
            className={defaultClasses.button}
          >
            {lastPage}
          </button>
        </>
      )}

      {/* Next page button */}
      {showPrevNext && (
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= lastPage}
          className={defaultClasses.button}
          aria-label="Go to next page"
        >
          ›
        </button>
      )}

      {/* Last page button */}
      {showFirstLast && currentPage < lastPage && (
        <button
          onClick={() => handlePageClick(lastPage)}
          className={defaultClasses.button}
          aria-label="Go to last page"
        >
          »»
        </button>
      )}
    </nav>
  );
};
