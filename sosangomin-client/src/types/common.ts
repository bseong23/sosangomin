export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder: string;
}
