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
  reply: {
    id: number;
    author: string;
    content: string;
    createdAt: string;
  };
  commentId: number; // 부모 댓글 ID
  onUpdate: (commentId: number, replyId: number, content: string) => void;
  onCancel: () => void;
}

export interface EditCommentProps {
  comment: {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    replies?: ReplyType[];
  };
  onUpdate: (commentId: number, content: string) => void;
  onCancel: () => void;
}

export interface CommentListProps {
  comments: CommentType[];
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
  comment: {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    replies?: ReplyType[];
  };
  onEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onAddReply: (commentId: number, content: string) => void;
  onEditReply: (commentId: number, replyId: number, content: string) => void;
  onDeleteReply: (commentId: number, replyId: number) => void;
}
