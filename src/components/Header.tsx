import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isAuthenticated } from "../api/auth";
import { ROUTES } from "../constants";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const authenticated = isAuthenticated();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link
          to={authenticated ? ROUTES.POSTS : ROUTES.CHARTS}
          className="header-logo"
        >
          게시판 시스템
        </Link>

        <div className="header-right">
          <Link
            to={ROUTES.CHARTS}
            className={`header-link ${isActive(ROUTES.CHARTS) ? "active" : ""}`}
          >
            데이터 시각화
          </Link>
          {authenticated && (
            <Link
              to={ROUTES.POSTS}
              className={`header-link ${
                isActive(ROUTES.POSTS) ? "active" : ""
              }`}
            >
              게시판
            </Link>
          )}
          {authenticated ? (
            <button onClick={logout} className="header-link logout-button">
              로그아웃
            </button>
          ) : (
            <Link to={ROUTES.LOGIN} className="header-link login-button">
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
