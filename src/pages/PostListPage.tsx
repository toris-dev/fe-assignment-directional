import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../api/posts";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { POSTS_PER_PAGE, ERROR_MESSAGES, ROUTES } from "../constants";
import type { Post, PostCategory, ApiError } from "../types";
import PostTable from "../components/PostTable";
import "./PostListPage.css";

const PostListPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PostCategory | "">("");
  const [sortBy, setSortBy] = useState<"title" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPosts = async (pageNum: number, reset: boolean = false) => {
      setLoading(true);
      setError("");
      try {
        const newPosts = await getPosts(
          pageNum,
          POSTS_PER_PAGE,
          search || undefined,
          category || undefined,
          sortBy,
          sortOrder
        );

        const postsArray = Array.isArray(newPosts) ? newPosts : [];

        if (reset) {
          setPosts(postsArray);
        } else {
          setPosts((prev) => [...prev, ...postsArray]);
        }

        setHasMore(postsArray.length === POSTS_PER_PAGE);
      } catch (err) {
        console.error("게시글 로드 실패:", err);
        const error = err as ApiError;
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          ERROR_MESSAGES.POST_LOAD_FAILED;
        setError(errorMessage);
        setHasMore(false);
        if (reset) {
          setPosts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    setHasMore(true);
    setPosts([]);
    setCurrentPage(1);
    loadPosts(1, true);
  }, [search, category, sortBy, sortOrder]);

  const handleLoadMore = async () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);

      setLoading(true);
      setError("");
      try {
        const newPosts = await getPosts(
          nextPage,
          POSTS_PER_PAGE,
          search || undefined,
          category || undefined,
          sortBy,
          sortOrder
        );

        const postsArray = Array.isArray(newPosts) ? newPosts : [];
        setPosts((prev) => [...prev, ...postsArray]);
        setHasMore(postsArray.length === POSTS_PER_PAGE);
      } catch (err) {
        console.error("게시글 로드 실패:", err);
        const error = err as ApiError;
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          ERROR_MESSAGES.POST_LOAD_FAILED;
        setError(errorMessage);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: handleLoadMore,
  });

  const handleCreatePost = () => {
    navigate(ROUTES.POSTS_CREATE);
  };

  const handleRowClick = (post: Post) => {
    navigate(ROUTES.POSTS_DETAIL(post.id));
  };

  const handleSortChange = (newSortBy: "title" | "createdAt") => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  return (
    <div className="post-list-page">
      <div className="post-list-header">
        <h1>게시판</h1>
        <button onClick={handleCreatePost} className="create-button">
          게시글 작성
        </button>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="제목 또는 본문 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="검색어 지우기"
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label className="filter-label">카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PostCategory | "")}
              className="category-select"
            >
              <option value="">전체</option>
              <option value="NOTICE">공지사항</option>
              <option value="QNA">질문</option>
              <option value="FREE">자유</option>
            </select>
          </div>

          <div className="sort-controls">
            <label className="filter-label">정렬</label>
            <div className="sort-buttons">
              <button
                onClick={() => handleSortChange("title")}
                className={`sort-button ${sortBy === "title" ? "active" : ""}`}
              >
                제목 {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => handleSortChange("createdAt")}
                className={`sort-button ${
                  sortBy === "createdAt" ? "active" : ""
                }`}
              >
                작성일{" "}
                {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            padding: "1rem",
            background: "#fee",
            color: "#c33",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {posts.length > 0 ? (
        <PostTable posts={posts} onRowClick={handleRowClick} />
      ) : !loading ? (
        <div className="no-posts">
          <div className="no-posts-icon">📝</div>
          <h3>게시글이 없습니다</h3>
          <p>첫 번째 게시글을 작성해보세요!</p>
          <button onClick={handleCreatePost} className="create-first-button">
            게시글 작성하기
          </button>
        </div>
      ) : null}

      <div ref={sentinelRef} style={{ height: "1px" }} />

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <span>로딩 중...</span>
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <div className="no-more">
          <span>📄</span>
          <span>더 이상 게시글이 없습니다.</span>
        </div>
      )}
    </div>
  );
};

export default PostListPage;
