export interface NewsItem {
  id: number;
  title: string;
  imageUrl: string;
  pubDate: string;
  category: string;
}

export interface NewsListResponse {
  items: NewsItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface NewsParams {
  page: number;
  limit: number;
  category?: string;
  search?: string;
}

export interface NewsPageCountResponse {
  pageCount: number;
}
