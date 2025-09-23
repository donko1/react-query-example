import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchLongTask = async ({ signal }) => {
  const response = await axios.get("http://localhost:5000/long-task", {
    signal,
  });
  return response.data;
};

export default function LongTaskComponent() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["longTask"],
    queryFn: fetchLongTask,
    enabled: false,
    retry: false,
  });

  const startTask = () => refetch();
  const cancelTask = () =>
    queryClient.cancelQueries({ queryKey: ["longTask"] });

  return (
    <div style={{ color: "black" }}>
      <button onClick={startTask} disabled={isFetching}>
        Начать задачу
      </button>
      <button onClick={cancelTask} disabled={!isFetching}>
        Отменить запрос
      </button>
      {isFetching && <p>Выполняется длительная задача...</p>}
      {isError && <p>Ошибка: {error.message}</p>}
      {data && <p>Результат: {JSON.stringify(data)}</p>}
    </div>
  );
}
