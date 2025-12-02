import apiClient from './client';
import { STORAGE_KEYS } from '../constants';
import type { LoginRequest, LoginResponse } from '../types';

/**
 * 로그인 API 호출
 * @param credentials 이메일과 비밀번호
 * @returns 로그인 응답 데이터
 */
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return response.data;
};

/**
 * 로그아웃 처리 (토큰 제거)
 */
export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * 현재 로그인 상태 확인
 * @returns 로그인 여부
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};

