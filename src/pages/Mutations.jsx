import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const fetchPosts = async () => {
  const { data } = await axios.get("http://localhost:5000/api/posts");
  return data;
};

const createPost = async (newPost) => {
  const { data } = await axios.post("http://localhost:5000/api/posts", newPost);
  return data;
};

const deletePost = async (postId) => {
  await axios.delete(`http://localhost:5000/api/posts/${postId}`);
  return postId;
};

const MutationExample = () => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setTitle("");
      setContent("");
    },
    onError: (error) => {
      console.error("Ошибка при создании поста:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({ title, content });
  };

  const handleDelete = (postId) => {
    if (window.confirm("Удалить этот пост?")) {
      deleteMutation.mutate(postId);
    }
  };

  if (isLoading) return <div>Загрузка постов...</div>;
  if (isError) return <div>Ошибка: {error.message}</div>;

  return (
    <div>
      <h2>Mutation Example</h2>

      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h3>Создать новый пост</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
              required
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <textarea
              placeholder="Содержание"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: "100%", padding: "8px", minHeight: "100px" }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isLoading}
            style={{
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {createMutation.isLoading ? "Создание..." : "Создать пост"}
          </button>
        </form>

        {createMutation.isError && (
          <div style={{ color: "red", marginTop: "10px" }}>
            Ошибка:{" "}
            {createMutation.error.response?.data?.error ||
              createMutation.error.message}
          </div>
        )}

        {createMutation.isSuccess && (
          <div style={{ color: "green", marginTop: "10px" }}>
            Пост успешно создан!
          </div>
        )}
      </div>

      <div>
        <h3>Существующие посты</h3>
        {posts && posts.length > 0 ? (
          <div style={{ display: "grid", gap: "15px" }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                <h4>{post.title}</h4>
                <p>{post.content}</p>
                <small>
                  Создан: {new Date(post.created_at).toLocaleString()}
                </small>
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleteMutation.isLoading}
                    style={{
                      padding: "5px 10px",
                      background: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    {deleteMutation.isLoading ? "Удаление..." : "Удалить"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Пока нет постов</p>
        )}
      </div>
    </div>
  );
};

export default MutationExample;
