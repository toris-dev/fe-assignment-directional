import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createPost, updatePost, getPost } from "../api/posts";
import {
  MAX_TITLE_LENGTH,
  MAX_BODY_LENGTH,
  MAX_TAG_COUNT,
  MAX_TAG_LENGTH,
  ROUTES,
  ERROR_MESSAGES,
} from "../constants";
import {
  findForbiddenWords,
  validateTag,
  validateTagCount,
} from "../utils/validation";
import type { PostRequest, ApiError } from "../types";
import "./PostFormPage.css";

const PostFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PostRequest & { tagInput: string }>({
    defaultValues: {
      title: "",
      body: "",
      category: "FREE",
      tags: [],
      tagInput: "",
    },
  });

  const tags = watch("tags");
  const tagInput = watch("tagInput");

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (isEdit && id) {
      const loadPost = async () => {
        try {
          const post = await getPost(id);
          setValue("title", post.title);
          setValue("body", post.body);
          setValue("category", post.category);
          setValue("tags", post.tags);
        } catch (err) {
          console.error("게시글 로드 실패:", err);
          navigate(ROUTES.POSTS);
        }
      };
      loadPost();
    }
  }, [isEdit, id, setValue, navigate]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    const tagError = validateTag(trimmedTag);
    if (tagError) {
      setError(tagError);
      return;
    }

    const countError = validateTagCount(tags.length);
    if (countError) {
      setError(countError);
      return;
    }

    if (tags.includes(trimmedTag)) {
      setError("이미 추가된 태그입니다.");
      return;
    }

    setValue("tags", [...tags, trimmedTag]);
    setValue("tagInput", "");
    setError("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data: PostRequest & { tagInput: string }) => {
    setError("");

    // 금칙어 검사
    const forbiddenInTitle = findForbiddenWords(data.title);
    const forbiddenInBody = findForbiddenWords(data.body);

    if (forbiddenInTitle.length > 0 || forbiddenInBody.length > 0) {
      setError(
        `금칙어가 포함되어 있습니다: ${[
          ...forbiddenInTitle,
          ...forbiddenInBody,
        ].join(", ")}`
      );
      return;
    }

    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tagInput, ...postData } = data;

      if (isEdit && id) {
        await updatePost(id, postData);
      } else {
        await createPost(postData);
      }
      navigate(ROUTES.POSTS);
    } catch (err) {
      const error = err as ApiError;
      const errorMessage =
        error.response?.data?.message ||
        (isEdit
          ? ERROR_MESSAGES.POST_UPDATE_FAILED
          : ERROR_MESSAGES.POST_CREATE_FAILED);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form-page">
      <div className="post-form-container">
        <h1>{isEdit ? "게시글 수정" : "게시글 작성"}</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* 제목 입력 */}
          <div className="form-group">
            <label htmlFor="title">
              제목{" "}
              <span className="char-count">
                ({watch("title")?.length || 0}/{MAX_TITLE_LENGTH})
              </span>
            </label>
            <input
              id="title"
              type="text"
              maxLength={MAX_TITLE_LENGTH}
              {...register("title", {
                required: "제목을 입력해주세요.",
                maxLength: {
                  value: MAX_TITLE_LENGTH,
                  message: `제목은 ${MAX_TITLE_LENGTH}자 이내로 입력해주세요.`,
                },
              })}
              placeholder="제목을 입력하세요"
            />
            {errors.title && (
              <span className="error">{errors.title.message}</span>
            )}
          </div>

          {/* 본문 입력 */}
          <div className="form-group">
            <label htmlFor="body">
              본문{" "}
              <span className="char-count">
                ({watch("body")?.length || 0}/{MAX_BODY_LENGTH})
              </span>
            </label>
            <textarea
              id="body"
              maxLength={MAX_BODY_LENGTH}
              rows={10}
              {...register("body", {
                required: "본문을 입력해주세요.",
                maxLength: {
                  value: MAX_BODY_LENGTH,
                  message: `본문은 ${MAX_BODY_LENGTH}자 이내로 입력해주세요.`,
                },
              })}
              placeholder="본문을 입력하세요"
            />
            {errors.body && (
              <span className="error">{errors.body.message}</span>
            )}
          </div>

          {/* 카테고리 선택 */}
          <div className="form-group">
            <label htmlFor="category">카테고리</label>
            <select
              id="category"
              {...register("category", {
                required: "카테고리를 선택해주세요.",
              })}
            >
              <option value="NOTICE">공지사항</option>
              <option value="QNA">질문</option>
              <option value="FREE">자유</option>
            </select>
            {errors.category && (
              <span className="error">{errors.category.message}</span>
            )}
          </div>

          {/* 태그 입력 */}
          <div className="form-group">
            <label htmlFor="tagInput">
              태그{" "}
              <span className="tag-count">
                ({tags.length}/{MAX_TAG_COUNT})
              </span>
            </label>
            <div className="tag-input-group">
              <input
                id="tagInput"
                type="text"
                maxLength={MAX_TAG_LENGTH}
                {...register("tagInput")}
                placeholder={`태그를 입력하고 추가 버튼을 클릭하세요 (최대 ${MAX_TAG_LENGTH}자)`}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="add-tag-button"
              >
                추가
              </button>
            </div>
            {tags.length > 0 && (
              <div className="tags-list">
                {tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="remove-tag-button"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && <div className="error-message">{error}</div>}

          {/* 버튼 영역 */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(ROUTES.POSTS)}
              className="cancel-button"
            >
              취소
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostFormPage;
