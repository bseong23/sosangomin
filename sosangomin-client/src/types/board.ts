export interface BoardItem {
  id: number;
  title: string;
  author: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  isNew?: boolean;
}

export interface BoardListResponse {
  items: BoardItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface BoardParams {
  page: number;
  limit: number;
  search?: string;
}

export interface BoardListProps {
  items: BoardItem[];
  boardType: "notice" | "board";
}

export interface BoardItemProps {
  item: BoardItem;
  boardType: "notice" | "board";
}
