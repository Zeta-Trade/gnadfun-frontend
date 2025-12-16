import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  children: (paginatedData: T[], currentPage: number, totalPages: number) => React.ReactNode;
  onPageChange?: (page: number) => void;
}

export default function Pagination<T>({
  data,
  itemsPerPage,
  children,
  onPageChange,
}: PaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = Math.min(startIdx + itemsPerPage, data.length);
  const paginatedData = data.slice(startIdx, endIdx);

  const handlePreviousPage = () => {
    const newPage = Math.max(currentPage - 1, 1);
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const handleNextPage = () => {
    const newPage = Math.min(currentPage + 1, totalPages);
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const getPrevRange = () => {
    if (currentPage === 1) return '0 - 0';
    const prevStart = (currentPage - 2) * itemsPerPage + 1;
    const prevEnd = Math.min((currentPage - 1) * itemsPerPage, data.length);
    return `${prevStart} - ${prevEnd}`;
  };

  const getCurrentRange = () => {
    const start = startIdx + 1;
    return `${start} - ${endIdx}`;
  };

  const getNextRange = () => {
    if (currentPage === totalPages) return '';
    const nextStart = endIdx + 1;
    const nextEnd = Math.min(currentPage * itemsPerPage + itemsPerPage, data.length);
    return `${nextStart} - ${nextEnd}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {children(paginatedData, currentPage, totalPages)}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-white/10 text-white/50">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-2 py-1 rounded-lg border border-white/20 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} className="text-white/60" />
            <span className="text-sm text-white/60">{getPrevRange()}</span>
          </button>

          <div className="text-sm font-semibold text-white px-2 py-1">
            {getCurrentRange()}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-2 py-1 rounded-lg border border-white/20 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span className="text-sm text-white/60">{getNextRange()}</span>
            <ChevronRight size={16} className="text-white/60" />
          </button>
        </div>
      )}
    </div>
  );
}
