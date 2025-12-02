import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, deletePost } from "../api/posts";
import { POST_CATEGORIES, ROUTES, ERROR_MESSAGES } from "../constants";
import { formatDate } from "../utils/date";
import type { ApiError, Post } from "../types";
import "./PostDetailPage.css";

/**
 * 게시글 상세 페이지 컴포넌트
 * 게시글의 상세 정보를 표시하고 수정/삭제 기능을 제공합니다.
 */
const PostDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  /**
   * 게시글 로드
   */
  const loadPost = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const postData = await getPost(id);
      setPost(postData);
    } catch (err) {
      const error = err as ApiError;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        ERROR_MESSAGES.POST_LOAD_FAILED;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id, loadPost]);

  /**
   * 게시글 삭제 핸들러
   */
  const handleDelete = useCallback(async () => {
    if (!id || !confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deletePost(id);
      navigate(ROUTES.POSTS);
    } catch (err) {
      const error = err as ApiError;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        ERROR_MESSAGES.POST_DELETE_FAILED;
      alert(errorMessage);
    }
  }, [id, navigate]);

  /**
   * 게시글 수정 핸들러
   */
  const handleEdit = useCallback(() => {
    if (id) {
      navigate(ROUTES.POSTS_EDIT(id));
    }
  }, [id, navigate]);

  /**
   * 목록으로 돌아가기
   */
  const handleBack = useCallback(() => {
    navigate(ROUTES.POSTS);
  }, [navigate]);

  if (loading) {
    return <div className="post-detail-page loading">로딩 중...</div>;
  }

  if (error || !post) {
    return (
      <div className="post-detail-page">
        <div className="error-message">{error || ERROR_MESSAGES.NOT_FOUND}</div>
        <button onClick={handleBack} className="back-button">
          목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <div className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="category">
              {POST_CATEGORIES[post.category] || post.category}
            </span>
            <span className="created-at">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="post-body">{post.body}</div>

        <div className="post-actions">
          <button onClick={handleBack} className="back-button">
            목록으로
          </button>
          <button onClick={handleEdit} className="edit-button">
            수정
          </button>
          <button onClick={handleDelete} className="delete-button">
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
