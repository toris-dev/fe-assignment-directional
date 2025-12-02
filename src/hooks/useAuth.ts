import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import {
  STORAGE_KEYS,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../constants";
import type { LoginRequest, ApiError } from "../types";

export const useAuth = () => {
  const navigate = useNavigate();

  const login = async (
    credentials: LoginRequest
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await loginUser(credentials);
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      navigate(ROUTES.POSTS);
      return { success: true, message: SUCCESS_MESSAGES.LOGIN_SUCCESS };
    } catch (error) {
      const err = error as ApiError;
      const message =
        err.response?.data?.message || ERROR_MESSAGES.LOGIN_FAILED;
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    navigate(ROUTES.LOGIN);
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  };

  return {
    login,
    logout,
    isAuthenticated,
  };
};
