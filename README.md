# 게시판 및 데이터 시각화 시스템

React 18 + TypeScript로 구현된 게시판 및 데이터 시각화 애플리케이션입니다.

## 📋 목차

- [프로젝트 실행 방법](#-프로젝트-실행-방법)
- [사용한 기술 스택](#-사용한-기술-스택)
- [주요 구현 기능 요약](#-주요-구현-기능-요약)
- [프로젝트 구조](#-프로젝트-구조)
- [API 엔드포인트](#-api-엔드포인트)

## 🚀 프로젝트 실행 방법

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 브라우저에서 http://localhost:5173 접속
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview

# 린트 검사
npm run lint
```

## 🛠 사용한 기술 스택

### Core

- **React 19.2.0** - UI 라이브러리
- **TypeScript 5.9.3** - 타입 안정성
- **Vite 7.2.4** - 빌드 도구 및 개발 서버

### 라우팅

- **React Router DOM 7.9.6** - 클라이언트 사이드 라우팅

### 상태 관리 및 데이터 페칭

- **Axios 1.13.2** - HTTP 클라이언트
- **React Hook Form 7.67.0** - 폼 상태 관리 및 유효성 검사

### UI 컴포넌트

- **TanStack Table 8.21.3** - 고급 테이블 기능 (정렬, 필터, 컬럼 조절, 가시성 제어)
- **Recharts 3.5.1** - 데이터 시각화 차트 라이브러리

### 개발 도구

- **ESLint 9.39.1** - 코드 품질 검사
- **TypeScript ESLint 8.46.4** - TypeScript 린팅

## ✨ 주요 구현 기능 요약

### 1. 인증 시스템

- ✅ JWT 기반 인증
- ✅ 로그인/로그아웃 기능
- ✅ 인증 보호 라우트 (Protected Route)
- ✅ 자동 토큰 갱신 및 401 에러 처리

### 2. 게시판 기능 (CRUD)

- ✅ **게시글 작성**: 제목, 본문, 카테고리, 태그 입력
- ✅ **게시글 조회**: 목록 조회 및 상세 조회
- ✅ **게시글 수정**: 본인이 작성한 게시글만 수정 가능
- ✅ **게시글 삭제**: 본인이 작성한 게시글만 삭제 가능

### 3. 게시판 고급 기능

- ✅ **무한 스크롤 페이지네이션**: Intersection Observer를 활용한 효율적인 데이터 로딩
- ✅ **검색 기능**: 제목 및 본문 내용 실시간 검색
- ✅ **정렬 기능**: 제목 또는 작성일 기준 오름/내림차순 정렬
- ✅ **카테고리 필터**: 공지사항, 질문, 자유 카테고리별 필터링
- ✅ **금칙어 필터**: 특정 단어 포함 시 게시글 등록 차단
- ✅ **컬럼 가시성 제어**: 테이블 컬럼 표시/숨김 기능
- ✅ **고정 헤더**: 스크롤 시 테이블 헤더 고정

### 4. 데이터 시각화 기능

#### 바 차트 & 도넛 차트

- ✅ Top Coffee Brands (바 차트, 도넛 차트)
- ✅ Popular Snack Brands (바 차트, 도넛 차트)

#### 스택형 차트

- ✅ Weekly Mood Trend (스택형 바 차트, 스택형 면적 차트)
- ✅ Weekly Workout Trend (스택형 바 차트, 스택형 면적 차트)

#### 멀티라인 차트

- ✅ Coffee Consumption (이중 Y축, 커스텀 마커, 팀별 데이터 구분)
- ✅ Snack Impact (이중 Y축, 커스텀 마커, 팀별 데이터 구분)

#### 차트 공통 기능

- ✅ 범례(Legend) 표시
- ✅ 범례에서 색상 변경 기능
- ✅ 범례에서 데이터 보이기/숨기기 토글
- ✅ 커스텀 툴팁 (멀티라인 차트)

### 5. UI/UX 개선

- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ✅ 모던한 디자인 (Glassmorphism, 그라데이션, 애니메이션)
- ✅ 로딩 상태 표시
- ✅ 에러 처리 및 사용자 친화적 에러 메시지
- ✅ 빈 상태(Empty State) 처리
- ✅ SEO 최적화 (Meta 태그, Open Graph, Twitter Card)

### 6. 코드 품질

- ✅ TypeScript를 통한 타입 안정성
- ✅ 커스텀 훅을 통한 로직 분리 (`useAuth`, `useInfiniteScroll`)
- ✅ 상수 및 유틸리티 함수 중앙화
- ✅ 에러 바운더리 구현
- ✅ 코드 구조화 및 재사용성 향상

## 📁 프로젝트 구조

```
src/
├── api/                 # API 클라이언트
│   ├── client.ts        # Axios 인스턴스 설정 (인터셉터 포함)
│   ├── auth.ts          # 인증 API
│   ├── posts.ts         # 게시글 API
│   └── charts.ts        # 차트 데이터 API
├── components/          # 재사용 가능한 컴포넌트
│   ├── Header.tsx       # 헤더 네비게이션
│   ├── PostTable.tsx    # 게시글 테이블 (TanStack Table)
│   ├── ErrorBoundary.tsx # 에러 바운더리
│   ├── ProtectedRoute.tsx # 인증 보호 라우트
│   └── charts/          # 차트 컴포넌트들
│       ├── BarChart.tsx
│       ├── DoughnutChart.tsx
│       ├── StackedBarChart.tsx
│       ├── StackedAreaChart.tsx
│       └── MultiLineChart.tsx
├── pages/               # 페이지 컴포넌트
│   ├── LoginPage.tsx    # 로그인 페이지
│   ├── PostListPage.tsx # 게시글 목록 페이지
│   ├── PostFormPage.tsx # 게시글 작성/수정 페이지
│   ├── PostDetailPage.tsx # 게시글 상세 페이지
│   └── ChartsPage.tsx   # 데이터 시각화 페이지
├── hooks/               # 커스텀 훅
│   ├── useAuth.ts       # 인증 관련 훅
│   └── useInfiniteScroll.ts # 무한 스크롤 훅
├── utils/               # 유틸리티 함수
│   ├── date.ts          # 날짜 포맷팅
│   ├── validation.ts    # 유효성 검사
│   └── forbiddenWords.ts # 금칙어 검사
├── constants/           # 상수 정의
│   └── index.ts         # API URL, 라우트, 메시지 등
├── types/               # TypeScript 타입 정의
│   └── index.ts         # 인터페이스 및 타입
├── App.tsx              # 메인 App 컴포넌트
└── main.tsx             # 진입점
```

## 🔌 API 엔드포인트

### Base URL

```
https://fe-hiring-rest-api.vercel.app
```

### 인증

- `POST /auth/login` - 로그인 (JWT 토큰 발급)

### 게시글

- `GET /posts` - 게시글 목록 조회 (쿼리 파라미터: page, limit, search, category, sortBy, sortOrder)
- `GET /posts/:id` - 게시글 단건 조회
- `POST /posts` - 게시글 작성
- `PATCH /posts/:id` - 게시글 수정
- `DELETE /posts/:id` - 게시글 삭제

### 차트 데이터 (Mock)

- `GET /mock/top-coffee-brands` - 커피 브랜드 데이터
- `GET /mock/popular-snack-brands` - 과자 브랜드 데이터
- `GET /mock/weekly-mood-trend` - 주간 기분 트렌드
- `GET /mock/weekly-workout-trend` - 주간 운동 트렌드
- `GET /mock/coffee-consumption` - 커피 소비량 데이터
- `GET /mock/snack-impact` - 과자 영향 데이터

## 📝 사용 방법

1. **로그인**: 제공된 이메일과 비밀번호로 로그인합니다.
2. **게시판**:
   - 게시글 작성, 조회, 수정, 삭제
   - 검색, 정렬, 필터 기능 활용
   - 컬럼 가시성 제어
3. **데이터 시각화**:
   - 로그인 없이도 차트 페이지 접근 가능
   - 다양한 차트 타입 확인
   - 범례를 통한 인터랙티브 제어

## 🔒 주의사항

- 모든 게시글 API는 인증이 필요합니다 (Bearer Token)
- 게시글은 본인이 작성한 것만 조회/수정/삭제 가능합니다
- 금칙어가 포함된 게시글은 등록할 수 없습니다 (캄보디아, 프놈펜, 불법체류, 텔레그램)
- 게시글 제목은 최대 80자, 본문은 최대 2000자로 제한됩니다
- 태그는 최대 5개까지, 각 태그는 24자 이내로 제한됩니다

## 🌐 배포 링크

**프로덕션 배포**: https://fe-assignment-directional.vercel.app

- **메인 페이지**: https://fe-assignment-directional.vercel.app
- **데이터 시각화**: https://fe-assignment-directional.vercel.app/charts
- **게시판** (로그인 필요): https://fe-assignment-directional.vercel.app/posts
