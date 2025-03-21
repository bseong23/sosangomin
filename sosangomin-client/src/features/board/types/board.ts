export interface BoardItem {
  boardId: number;
  title: string;
  name: string;
  content: string;
  createdAt: string;
  views: number;
}

export interface BoardListResponse {
  items: BoardItem[]; // items는 BoardItem 배열입니다.
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
  item: any; // 또는 더 구체적인 타입
  boardType: "notice" | "board";
  isMobile?: boolean; // isMobile 속성 추가 (선택적으로 만들 수도 있음)
}

export interface ReplyType {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

export interface CommentType {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  isVerified: boolean;
  profileUrl?: string;
  replies?: ReplyType[];
}

export interface PostType {
  id: string | undefined;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  comments: CommentType[];
}

export interface ReplyProps {
  reply: {
    id: number;
    author: string;
    content: string;
    createdAt: string;
  };
  commentId: number; // 부모 댓글 ID
  onEdit: (commentId: number, replyId: number) => void;
  onDelete: (commentId: number, replyId: number) => void;
}

export interface EditReplyProps {
  reply: ReplyType;
  commentId: number; // 부모 댓글 ID
  onUpdate: (commentId: number, replyId: number, content: string) => void;
  onCancel: () => void;
}

export interface EditCommentProps {
  comment: CommentType;
  onUpdate: (commentId: number, content: string) => void;
  onCancel: () => void;
}

export interface CommentListProps {
  boardId: string;
  onAddComment: (content: string) => void;
  onUpdateComment: (commentId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
  onAddReply: (commentId: number, content: string) => void;
  onUpdateReply: (commentId: number, replyId: number, content: string) => void;
  onDeleteReply: (commentId: number, replyId: number) => void;
}

export interface CommentFormProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  buttonText?: string;
  minHeight?: string;
}

export interface CommentProps {
  comment: CommentType;
  onEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onAddReply: (commentId: number, content: string) => void;
  onEditReply: (commentId: number, replyId: number, content: string) => void;
  onDeleteReply: (commentId: number, replyId: number) => void;
}

export interface PageCountResponse {
  pageCount: number;
}
