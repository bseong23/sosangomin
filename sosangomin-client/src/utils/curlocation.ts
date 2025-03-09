// 헤더 메뉴 활성화 여부 확인 함수
export const isPathActive = (
  currentPath: string,
  targetPath: string
): boolean => {
  if (targetPath === "/service") {
    return currentPath.startsWith("/service");
  } else if (targetPath === "/data-analysis/upload") {
    return currentPath.startsWith("/data-analysis");
  } else if (targetPath === "/map") {
    return currentPath.startsWith("/map");
  } else if (targetPath === "/community/notice") {
    return currentPath.startsWith("/community");
  }
  return false;
};

// 사이드바 메뉴 활성화 여부 확인 함수
export const isSidebarItemActive = (
  currentPath: string,
  targetPath: string
): boolean => {
  // 공지사항, 뉴스, 게시판 등의 하위 경로까지 고려
  if (targetPath.includes("/notice")) {
    return currentPath.includes("/notice");
  } else if (targetPath.includes("/news")) {
    return currentPath.includes("/news");
  } else if (targetPath.includes("/board")) {
    return currentPath.includes("/board");
  } else if (targetPath.includes("/upload")) {
    return currentPath.includes("/upload");
  } else if (targetPath.includes("/research")) {
    return currentPath.includes("/research");
  } else if (targetPath.includes("/insight")) {
    return currentPath === "/data-analysis/insight";
  } else if (targetPath.includes("/review-insight")) {
    return currentPath.includes("/review-insight");
  } else if (targetPath.includes("/advise")) {
    return currentPath.includes("/advise");
  }

  // 정확히 일치하는 경우
  return currentPath === targetPath;
};
