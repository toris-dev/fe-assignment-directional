import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PostListPage from './pages/PostListPage';
import PostFormPage from './pages/PostFormPage';
import PostDetailPage from './pages/PostDetailPage';
import ChartsPage from './pages/ChartsPage';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import { isAuthenticated } from './api/auth';
import { ROUTES } from './constants';
import './App.css';

/**
 * 메인 App 컴포넌트
 * 라우팅 및 네비게이션을 관리합니다.
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          {/* 헤더 */}
          <Header />

          {/* 라우트 */}
          <Routes>
            <Route
              path={ROUTES.LOGIN}
              element={isAuthenticated() ? <Navigate to={ROUTES.POSTS} replace /> : <LoginPage />}
            />
            <Route
              path={ROUTES.POSTS}
              element={
                <ProtectedRoute>
                  <PostListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.POSTS_CREATE}
              element={
                <ProtectedRoute>
                  <PostFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.POSTS_DETAIL(':id')}
              element={
                <ProtectedRoute>
                  <PostDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.POSTS_EDIT(':id')}
              element={
                <ProtectedRoute>
                  <PostFormPage />
                </ProtectedRoute>
              }
            />
            {/* 데이터 시각화는 로그인 없이 접근 가능 */}
            <Route path={ROUTES.CHARTS} element={<ChartsPage />} />
            <Route
              path="/"
              element={
                <Navigate to={isAuthenticated() ? ROUTES.POSTS : ROUTES.CHARTS} replace />
              }
            />
          </Routes>
      </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
