export interface MenuItem {
  label: string;
  path: string;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export interface SidebarProps {
  isOpen: boolean;
  toggleSidebar?: () => void;
}
