/**
 * 금칙어 관련 유틸리티 함수
 * @deprecated 이 파일은 constants/index.ts로 이동되었습니다.
 * 새로운 코드에서는 constants에서 FORBIDDEN_WORDS를 import하고,
 * utils/validation.ts의 findForbiddenWords 함수를 사용하세요.
 */

import { FORBIDDEN_WORDS } from '../constants';

/**
 * 텍스트에 금칙어가 포함되어 있는지 확인
 * @param text 검사할 텍스트
 * @returns 금칙어 포함 여부
 * @deprecated utils/validation.ts의 hasForbiddenWords를 사용하세요.
 */
export const containsForbiddenWord = (text: string): boolean => {
  return FORBIDDEN_WORDS.some((word) => text.includes(word));
};

/**
 * 텍스트에서 금칙어를 찾아 반환
 * @param text 검사할 텍스트
 * @returns 발견된 금칙어 배열
 * @deprecated utils/validation.ts의 findForbiddenWords를 사용하세요.
 */
export const findForbiddenWords = (text: string): string[] => {
  return FORBIDDEN_WORDS.filter((word) => text.includes(word));
};

