import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// API функции
const api = {
  getPosts: () => axios.get(`${API_URL}/posts`).then((res) => res.data),
  getPost: (id) =>
    axios.get(`${API_URL}/posts`).then((res) => {
      const post = res.data.find((post) => post.id === id);
      if (!post) throw new Error("Post not found");
      return post;
    }),
  createPost: (postData) =>
    axios.post(`${API_URL}/posts`, postData).then((res) => res.data),
  deletePost: (id) =>
    axios.delete(`${API_URL}/posts/${id}`).then((res) => res.data),
};

// Стили с черным текстом
const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    color: "#000000", // Черный текст
    fontFamily: "Arial, sans-serif",
  },
  section: {
    marginBottom: "30px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  input: {
    marginRight: "10px",
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "3px",
    color: "#000000", // Черный текст
    backgroundColor: "#ffffff",
  },
  button: {
    padding: "5px 10px",
    border: "1px solid #ccc",
    borderRadius: "3px",
    backgroundColor: "#fff",
    color: "#000000", // Черный текст
    cursor: "pointer",
  },
  buttonDisabled: {
    padding: "5px 10px",
    border: "1px solid #eee",
    borderRadius: "3px",
    backgroundColor: "#f5f5f5",
    color: "#666666",
    cursor: "not-allowed",
  },
  postList: {
    border: "1px solid #ccc",
    padding: "10px",
    minHeight: "200px",
    borderRadius: "5px",
    backgroundColor: "#ffffff",
  },
  postItem: {
    padding: "10px",
    margin: "5px 0",
    border: "1px solid #eee",
    borderRadius: "3px",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  postItemSelected: {
    padding: "10px",
    margin: "5px 0",
    border: "2px solid #007acc",
    borderRadius: "3px",
    backgroundColor: "#e6f7ff",
    cursor: "pointer",
  },
  debugInfo: {
    marginTop: "30px",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "5px",
    color: "#000000", // Черный текст
  },
  flexContainer: {
    display: "flex",
    gap: "30px",
    color: "#000000", // Черный текст
  },
};

export const QueryKeyExample = () => {
  const queryClient = useQueryClient();
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  // Запрос 1: Получить все посты
  const { data: allPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: api.getPosts,
  });

  // Запрос 2: Получить конкретный пост
  const { data: selectedPost, isLoading: postLoading } = useQuery({
    queryKey: ["post", selectedPostId],
    queryFn: () => api.getPost(selectedPostId),
    enabled: !!selectedPostId,
  });

  // Мутация: Создать новый пост
  const createPostMutation = useMutation({
    mutationFn: api.createPost,
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewPostTitle("");
      setNewPostContent("");
      console.log('✅ Пост создан! Запрос "posts" инвалидирован');
    },
    onError: (error) => {
      console.error("Ошибка при создании поста:", error);
    },
  });

  // Мутация: Удалить пост
  const deletePostMutation = useMutation({
    mutationFn: api.deletePost,
    onSuccess: (_, deletedPostId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", deletedPostId] });

      if (selectedPostId === deletedPostId) {
        setSelectedPostId(null);
      }

      console.log("🗑️ Пост удален! Запросы инвалидированы");
    },
  });

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    createPostMutation.mutate({
      title: newPostTitle,
      content: newPostContent,
    });
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Удалить этот пост?")) {
      deletePostMutation.mutate(postId);
    }
  };

  const handleInvalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    console.log('🔄 Все запросы с ключом "posts" инвалидированы');
  };

  const handleInvalidateSelected = () => {
    if (!selectedPostId) return;
    queryClient.invalidateQueries({ queryKey: ["post", selectedPostId] });
    console.log(`🔄 Пост ${selectedPostId} инвалидирован`);
  };

  if (postsLoading)
    return <div style={{ color: "#000000" }}>Загрузка постов...</div>;

  return (
    <div style={styles.container}>
      <h1 style={{ color: "#000000" }}>
        📚 Демонстрация queryKey в React Query
      </h1>

      {/* Секция создания поста */}
      <div style={styles.section}>
        <h2 style={{ color: "#000000" }}>✏️ Создать новый пост</h2>
        <div>
          <input
            type="text"
            placeholder="Заголовок"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Содержание"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            style={{ ...styles.input, width: "200px" }}
          />
          <button
            onClick={handleCreatePost}
            disabled={createPostMutation.isPending}
            style={
              createPostMutation.isPending
                ? styles.buttonDisabled
                : styles.button
            }
          >
            {createPostMutation.isPending ? "Создание..." : "Создать пост"}
          </button>
        </div>
      </div>

      {/* Кнопки инвалидации */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleInvalidateAll} style={styles.button}>
          🔄 Инвалидировать ВСЕ посты (key: ['posts'])
        </button>
        <button
          onClick={handleInvalidateSelected}
          disabled={!selectedPostId}
          style={!selectedPostId ? styles.buttonDisabled : styles.button}
        >
          {`🔄 Инвалидировать выбранный пост (key: ['post', '${selectedPostId}'])`}
        </button>
      </div>

      <div style={styles.flexContainer}>
        {/* Секция списка постов */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#000000" }}>
            📋 Все посты (queryKey: ['posts'])
          </h2>
          <div style={styles.postList}>
            {allPosts?.map((post) => (
              <div
                key={post.id}
                style={
                  selectedPostId === post.id
                    ? styles.postItemSelected
                    : styles.postItem
                }
                onClick={() => setSelectedPostId(post.id)}
              >
                <strong style={{ color: "#000000" }}>{post.title}</strong>
                <p
                  style={{
                    margin: "5px 0",
                    fontSize: "0.9em",
                    color: "#000000",
                  }}
                >
                  {post.content}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePost(post.id);
                  }}
                  style={{
                    fontSize: "0.8em",
                    padding: "2px 5px",
                    color: "#000000",
                    backgroundColor: "#ffebee",
                    border: "1px solid #ffcdd2",
                    borderRadius: "3px",
                    cursor: deletePostMutation.isPending
                      ? "not-allowed"
                      : "pointer",
                  }}
                  disabled={deletePostMutation.isPending}
                >
                  {deletePostMutation.isPending ? "Удаление..." : "❌ Удалить"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Секция деталей поста */}
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#000000" }}>
            📄 Детали поста{" "}
            {selectedPostId && `(queryKey: ['post', '${selectedPostId}'])`}
          </h2>
          <div style={styles.postList}>
            {!selectedPostId ? (
              <p style={{ color: "#000000" }}>👈 Выберите пост из списка</p>
            ) : postLoading ? (
              <p style={{ color: "#000000" }}>Загрузка деталей поста...</p>
            ) : selectedPost ? (
              <div style={{ color: "#000000" }}>
                <h3>{selectedPost.title}</h3>
                <p>{selectedPost.content}</p>
                <p>
                  <small>
                    Создан: {new Date(selectedPost.created_at).toLocaleString()}
                  </small>
                </p>
                <p>
                  <small>ID: {selectedPost.id}</small>
                </p>
              </div>
            ) : (
              <p style={{ color: "#000000" }}>Пост не найден</p>
            )}
          </div>
        </div>
      </div>

      {/* Отладочная информация */}
      <div style={styles.debugInfo}>
        <h3 style={{ color: "#000000" }}>🔍 Отладочная информация:</h3>
        <p style={{ color: "#000000" }}>
          <strong>Текущий выбранный ID:</strong> {selectedPostId || "нет"}
        </p>
        <p style={{ color: "#000000" }}>
          <strong>Ключ запроса всех постов:</strong> ['posts']
        </p>
        <p style={{ color: "#000000" }}>
          <strong>Ключ запроса деталей поста:</strong>{" "}
          {selectedPostId ? `['post', '${selectedPostId}']` : "не активен"}
        </p>
        <p style={{ color: "#000000" }}>
          <strong>Количество постов:</strong> {allPosts?.length || 0}
        </p>
      </div>
    </div>
  );
};

export default QueryKeyExample;
