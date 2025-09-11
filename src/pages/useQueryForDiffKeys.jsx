import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const fetchById = async (id) => {
  const { data } = await axios.get(`http://127.0.0.1:5000/api/${id}`);
  return data.results || data;
};

export default function UseQueryForDiffKeys() {
  const [id, setId] = useState(1);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["useQueryForDiffKeys", id],
    queryFn: () => fetchById(id),
  });

  const handleIdChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= 3) {
      setId(value);
    }
  };

  return (
    <div>
      {isLoading && <h1>Загрузка...</h1>}
      {isError && <h1 style={{ color: "red" }}>Ошибка: {error.message}</h1>}
      <h1>
        Вводите число от 1 до 3 и в зависимости от этого будет меняться запрос
      </h1>
      <input
        type="number"
        value={id}
        onChange={handleIdChange}
        min="1"
        max="3"
        step="1"
      />
      {data && <h1>{data.detail}</h1>}
    </div>
  );
}
