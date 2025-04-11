// types/layout.ts
export interface SideItem {
  title: string;
  path?: string;
  children?: SideItem[];
  isOpen?: boolean;
}
