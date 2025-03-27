# 소상고민 (Sosangomin) 프론트엔드

## 프로젝트 개요

소상고민은 React와 TypeScript 기반의 프론트엔드 애플리케이션으로, 소상공인들을 위한 데이터 분석 및 시각화 서비스를 제공합니다. POS기 데이터 분석, 네이버 리뷰 분석, 경쟁업체 비교, 입지추천 및 상권분석 기능을 사용자 친화적인 인터페이스로 제공합니다.

## 주요 화면

![대시보드 화면](./src/assets//README/main.png)
_대시보드 화면 설명_
![리뷰 화면](./src/assets/README/review.png)
_리뷰 화면 설명_
![지도 화면](./src/assets/README/map.png)
_지도 화면 설명_

## 기술 스택

- **프레임워크**: React 19
- **언어**: TypeScript
- **상태 관리**: Zustand
- **스타일링**: TailwindCSS 4
- **빌드 도구**: Vite 6
- **라우팅**: React Router v7
- **UI 컴포넌트**: 자체 구현 컴포넌트
- **차트 시각화**: Chart.js, react-chartjs-2
- **애니메이션**: Framer Motion
- **HTTP 클라이언트**: Axios
- **아이콘**: React Icons
- **폰트**: Pretendard
- **툴팁**: Tippy.js
- **PWA 지원**: Vite PWA

## 개발 환경 설정

### 필수 조건

- Node.js (최신 LTS 버전 권장)
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 타입스크립트 빌드 및 프로덕션 빌드
npm run build

# ESLint 검사
npm run lint

# 빌드 결과물 미리보기
npm run preview
```

## 프론트엔드 폴더 구조

```
src/
├── api/            # API 호출 관련 코드
│   ├── axios.ts    # Axios 인스턴스 및 인터셉터
│   └── chatApi.ts
├── assets/         # 정적 자산 (이미지, 아이콘 등)
├── components/     # 재사용 가능한 공통 컴포넌트
│   ├── chart/
│   ├── common/
│   ├── footer/
│   ├── modal/
│   ├── main/
│   ├── sidebar/
│   ├── header/
│   └── layout/
├── features/       # 기능별 컴포넌트
│   ├── analysis/   # 데이터 분석 관련 컴포넌트
│   ├── review/     # 리뷰 분석 관련 컴포넌트
│   ├── map/        # 지도 및 상권 분석 컴포넌트
│   ├── auth/       # 유저 관리
│   └── board/      # 커뮤니티
├── mock/           # 개발용 목업 데이터
├── pages/          # 페이지 컴포넌트
├── store/          # Zustand 상태 관리
│   ├── useAuthStore.ts
│   ├── storeModalStore.ts
│   ├── modalStore.ts
│   └── mapStore.ts
├── styles/         # 전역 스타일 및 테마
│   └── index.css/
├── types/          # TypeScript 타입 정의
│   ├── chart.ts
│   ├── chat.ts
│   ├── common.ts
│   ├── header.ts
│   ├── layout.ts
│   └── sidebar.ts
├── utils/          # 유틸리티 함수
│   └── curlocation.ts
├── App.tsx         # 앱 루트 컴포넌트
├── main.tsx        # 앱 진입점
├── vite-env.d.ts   # Vite 환경 타입 정의
└── .env            # 환경 변수
```

## 주요 컴포넌트 및 기능

### 분석 대시보드

- 매출 데이터 시각화 (Chart.js)
- 기간별 트렌드 분석
- 필터링 및 정렬 기능

### 리뷰 분석

- 워드 클라우드 시각화
- 감성 분석 결과 표시
- 리뷰 트렌드 그래프

### 지도 기반 상권 분석

- 지역별 데이터 시각화
- 히트맵 표시
- 위치 기반 추천

### 보고서 생성

- SWOT 분석 결과 시각화
- PDF 내보내기 기능
- 커스텀 템플릿 선택

## 상태 관리 (Zustand)

각 기능별로 분리된 스토어를 사용하여 상태 관리:

```typescript
// 예시: useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponse } from "@/features/auth/types/auth";

// 인증 스토어 상태 타입
interface AuthState {
  userInfo: LoginResponse | null;
  isAuthenticated: boolean;
  // 상태 변경 함수들
  setUserInfo: (userInfo: LoginResponse) => void;
  updateUserInfo: (updates: Partial<LoginResponse>) => void;
  clearUserInfo: () => void;
}

// Zustand 스토어 생성
const useAuthStore = create<AuthState>()(
  // persist 미들웨어로 로컬스토리지 지속성 추가
  persist(
    (set) => ({
      userInfo: null,
      isAuthenticated: false,

      // 사용자 정보 설정
      setUserInfo: (userInfo) => set({ userInfo, isAuthenticated: true }),

      // 사용자 정보 업데이트
      updateUserInfo: (updates) =>
        set((state) => ({
          userInfo: state.userInfo ? { ...state.userInfo, ...updates } : null
        })),

      // 사용자 정보 제거 (로그아웃)
      clearUserInfo: () => set({ userInfo: null, isAuthenticated: false })
    }),
    {
      name: "auth-storage", // 로컬스토리지에 저장될 키 이름
      partialize: (state) => ({ userInfo: state.userInfo }) // 저장할 부분 상태 선택
    }
  )
);

export default useAuthStore;
```

## API 통신

Axios를 사용한 API 클라이언트 구성:

```typescript
// api/axios.ts
// src/api/axios.ts
import axios from "axios";
import { getAccessToken } from "@/features/auth/api/userStorage";

// 기본 axios 인스턴스 생성
const API_URL = import.meta.env.VITE_API_SERVER_URL || "";
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// 요청 인터셉터 - 모든 요청에 토큰 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

## 스타일링

TailwindCSS를 사용한 스타일링 예시:

```tsx
// 반응형 카드 컴포넌트 예시
import React, { useState } from "react";
import { SearchBarProps } from "@/types/common";

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center relative h-5">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={placeholder}
        className="border border-gray-300 rounded-full px-5 py-2 w-50 pr-10"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        aria-label="검색"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
```

## 성능 최적화

- 이미지 최적화 및 지연 로딩
- 코드 스플리팅 및 동적 임포트
- Zustand 셀렉터를 사용한 효율적인 상태 구독

## 배포 방법

소상고민 프로젝트는 CI/CD 파이프라인을 통한 자동 배포가 구성되어 있습니다:

```bash
# 개발 환경 배포
# dev 브랜치에 코드를 푸시하면 자동으로 개발 서버에 배포됩니다
git push origin dev

# 프로덕션 환경 배포
# main 브랜치에 코드를 푸시하면 자동으로 프로덕션 서버에 배포됩니다
git push origin main
```

배포 파이프라인은 코드 푸시 시 자동으로 다음 단계를 수행합니다

1. 코드 품질 검사 (lint, type 체크)
2. 테스트 실행
3. 빌드 프로세스 수행
4. 배포 환경에 적용

## 브라우저 지원

- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)

## 코드 컨벤션

- 컴포넌트: PascalCase (.tsx)
- 유틸리티/훅: camelCase (.ts)
- 공통 컴포넌트는 `/components`에 위치
- 기능별 컴포넌트는 `/features`에 위치
- ESLint 및 Prettier 설정 준수
