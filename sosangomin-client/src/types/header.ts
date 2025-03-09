export interface NavItem {
  name: string;
  path: string;
}

export interface UserInfo {
  userId: string;
  userName: string;
  userProfileUrl: string | null;
  isFirstLogin: boolean;
}
