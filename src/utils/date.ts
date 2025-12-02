/**
 * 날짜 관련 유틸리티 함수
 */

/**
 * 날짜를 한국어 형식으로 포맷팅
 * @param dateString ISO 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2024년 1월 1일 오후 3:00")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

/**
 * 날짜를 간단한 형식으로 포맷팅
 * @param dateString ISO 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2024-01-01 15:00")
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 상대 시간 표시 (예: "3분 전", "1시간 전")
 * @param dateString ISO 날짜 문자열
 * @returns 상대 시간 문자열
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return '방금 전';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  }

  return formatDateShort(dateString);
};

