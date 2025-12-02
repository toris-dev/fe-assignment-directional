// 게시글 카테고리 타입
export type PostCategory = "NOTICE" | "QNA" | "FREE";

// 게시글 데이터 구조
export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: PostCategory;
  tags: string[];
  createdAt: string;
}

// 게시글 작성/수정 요청 데이터
export interface PostRequest {
  title: string;
  body: string;
  category: PostCategory;
  tags: string[];
}

// 로그인 요청 데이터
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 데이터
export interface LoginResponse {
  token: string;
}

// API 에러 타입
export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

// 차트 데이터 타입들
export interface TopCoffeeBrands {
  brand: string;
  popularity: number;
}

export interface PopularSnackBrands {
  name: string;
  share: number;
}

export interface WeeklyMoodTrend {
  week: string;
  happy: number;
  tired: number;
  stressed: number;
}

export interface WeeklyWorkoutTrend {
  week: string;
  running: number;
  cycling: number;
  stretching: number;
}

export interface CoffeeConsumption {
  coffee: number;
  team: string;
  bugs: number;
  productivity: number;
}

export interface SnackImpact {
  snacks: number;
  team: string;
  meetingMissed: number;
  morale: number;
}
