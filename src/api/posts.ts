import apiClient from "./client";
import type { Post, PostRequest } from "../types";

export const getPosts = async (
  page: number = 1,
  limit: number = 20,
  search?: string,
  category?: string,
  sortBy?: "title" | "createdAt",
  sortOrder?: "asc" | "desc"
): Promise<Post[]> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  if (search) params.search = search;
  if (category) params.category = category;
  if (sortBy) params.sortBy = sortBy;
  if (sortOrder) params.sortOrder = sortOrder;

  const response = await apiClient.get("/posts", { params });

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data?.items && Array.isArray(response.data.items)) {
    return response.data.items;
  }

  if (response.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }

  if (response.data?.posts && Array.isArray(response.data.posts)) {
    return response.data.posts;
  }

  return [];
};

export const getPost = async (id: string): Promise<Post> => {
  const response = await apiClient.get<Post>(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData: PostRequest): Promise<Post> => {
  const response = await apiClient.post<Post>("/posts", postData);
  return response.data;
};

export const updatePost = async (
  id: string,
  postData: Partial<PostRequest>
): Promise<Post> => {
  const response = await apiClient.patch<Post>(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id: string): Promise<void> => {
  await apiClient.delete(`/posts/${id}`);
};
