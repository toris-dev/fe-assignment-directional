import {
  MAX_TITLE_LENGTH,
  MAX_BODY_LENGTH,
  MAX_TAG_LENGTH,
  MAX_TAG_COUNT,
} from "../constants";
import { FORBIDDEN_WORDS } from "../constants";

export const validateTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) {
    return "제목을 입력해주세요.";
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return `제목은 ${MAX_TITLE_LENGTH}자 이내로 입력해주세요.`;
  }
  return null;
};

export const validateBody = (body: string): string | null => {
  if (!body || body.trim().length === 0) {
    return "본문을 입력해주세요.";
  }
  if (body.length > MAX_BODY_LENGTH) {
    return `본문은 ${MAX_BODY_LENGTH}자 이내로 입력해주세요.`;
  }
  return null;
};

export const validateTag = (tag: string): string | null => {
  if (!tag || tag.trim().length === 0) {
    return "태그를 입력해주세요.";
  }
  if (tag.length > MAX_TAG_LENGTH) {
    return `태그는 ${MAX_TAG_LENGTH}자 이내로 입력해주세요.`;
  }
  return null;
};

export const validateTagCount = (tagCount: number): string | null => {
  if (tagCount >= MAX_TAG_COUNT) {
    return `태그는 최대 ${MAX_TAG_COUNT}개까지 추가할 수 있습니다.`;
  }
  return null;
};

export const findForbiddenWords = (text: string): string[] => {
  const found: string[] = [];
  FORBIDDEN_WORDS.forEach((word) => {
    if (text.includes(word)) {
      found.push(word);
    }
  });
  return found;
};

export const hasForbiddenWords = (text: string): boolean => {
  return findForbiddenWords(text).length > 0;
};
