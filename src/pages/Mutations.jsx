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
    onMutate: async (newPost) => {
      // Отменяем исходящие запросы чтобы избежать конфликтов
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Сохраняем предыдущие данные для отката
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Оптимистичное обновление данных
      queryClient.setQueryData(["posts"], (old) => [
        ...old,
        {
          id: Date.now(), // Временный ID
          ...newPost,
          created_at: new Date().toISOString(),
        },
      ]);

      // Возвращаем контекст с предыдущими данными
      return { previousPosts };
    },
    onError: (error, newPost, context) => {
      // Откатываем изменения в случае ошибки
      queryClient.setQueryData(["posts"], context.previousPosts);
      console.error("Ошибка при создании поста:", error);
    },
    onSuccess: (data, newPost, context) => {
      console.log("Пост успешно создан на сервере!", data);
      // Можно инвалидировать кэш вместо оптимистичного обновления
      // queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onSettled: (data, error, newPost, context) => {
      // Выполняется в любом случае после успеха или ошибки
      console.log("Мутация завершена!");
      // Инвалидируем кэш для обновления данных с сервера
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old) =>
        old.filter((post) => post.id !== postId)
      );

      return { previousPosts };
    },
    onError: (error, postId, context) => {
      queryClient.setQueryData(["posts"], context.previousPosts);
      console.error("Ошибка при удалении поста:", error);
    },
    onSuccess: (data, postId, context) => {
      console.log("Пост успешно удален!");
    },
    onSettled: () => {
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
