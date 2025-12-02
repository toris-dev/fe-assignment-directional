// API 설정
export const API_BASE_URL = "https://fe-hiring-rest-api.vercel.app";

// 페이지네이션 설정
export const POSTS_PER_PAGE = 20;
export const SCROLL_THRESHOLD = 100; // 무한 스크롤 트리거 거리 (px)

// 게시글 제한
export const MAX_TITLE_LENGTH = 80;
export const MAX_BODY_LENGTH = 2000;
export const MAX_TAG_COUNT = 5;
export const MAX_TAG_LENGTH = 24;

// 금칙어 목록
export const FORBIDDEN_WORDS = [
  "캄보디아",
  "프놈펜",
  "불법체류",
  "텔레그램",
] as const;

// 게시글 카테고리
export const POST_CATEGORIES = {
  NOTICE: "공지사항",
  QNA: "질문",
  FREE: "자유",
} as const;

// 카테고리 색상 매핑
export const CATEGORY_COLORS = {
  NOTICE: "#667eea",
  QNA: "#48bb78",
  FREE: "#ed8936",
} as const;

// 차트 색상 팔레트
export const CHART_COLORS = [
  "#667eea",
  "#764ba2",
  "#f093fb",
  "#4facfe",
  "#43e97b",
  "#fa709a",
] as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  TOKEN: "token",
} as const;

// 라우트 경로
export const ROUTES = {
  LOGIN: "/login",
  POSTS: "/posts",
  POSTS_CREATE: "/posts/create",
  POSTS_EDIT: (id: string) => `/posts/${id}/edit`,
  POSTS_DETAIL: (id: string) => `/posts/${id}`,
  CHARTS: "/charts",
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  UNAUTHORIZED: "인증이 필요합니다. 다시 로그인해주세요.",
  NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",
  FORBIDDEN: "접근 권한이 없습니다.",
  SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
  POST_LOAD_FAILED: "게시글을 불러오는데 실패했습니다.",
  POST_CREATE_FAILED: "게시글 작성에 실패했습니다.",
  POST_UPDATE_FAILED: "게시글 수정에 실패했습니다.",
  POST_DELETE_FAILED: "게시글 삭제에 실패했습니다.",
  LOGIN_FAILED: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
  CHART_LOAD_FAILED: "차트 데이터를 불러오는데 실패했습니다.",
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  POST_CREATED: "게시글이 성공적으로 작성되었습니다.",
  POST_UPDATED: "게시글이 성공적으로 수정되었습니다.",
  POST_DELETED: "게시글이 성공적으로 삭제되었습니다.",
  LOGIN_SUCCESS: "로그인에 성공했습니다.",
} as const;
