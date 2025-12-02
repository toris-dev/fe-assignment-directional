import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { ERROR_MESSAGES } from "../constants";
import type { ApiError } from "../types";
import "./LoginPage.css";

/**
 * 로그인 페이지 컴포넌트
 * 이메일과 비밀번호를 입력받아 JWT 토큰을 발급받습니다.
 */
const LoginPage = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
  }>();

  /**
   * 로그인 폼 제출 핸들러
   * API를 호출하여 토큰을 받아온 후 메인 페이지로 이동합니다.
   */
  const onSubmit = async (data: { email: string; password: string }) => {
    setError("");
    setLoading(true);
    try {
      const result = await login(data);
      if (!result.success) {
        setError(result.message || ERROR_MESSAGES.LOGIN_FAILED);
      }
    } catch (err) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message ||
          error.message ||
          ERROR_MESSAGES.LOGIN_FAILED
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>로그인</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "이메일을 입력해주세요." })}
              placeholder="이메일을 입력하세요"
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
              })}
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
