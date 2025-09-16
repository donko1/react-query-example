import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const fetchBreeds = async () => {
  const { data } = await axios.get("https://dogapi.dog/api/v2/breeds/");
  return data;
};

export default function DogBreeds() {
  const [forceRefresh, setForceRefresh] = useState(0);
  const { data, isFetching, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dogBreeds", forceRefresh],
    queryFn: fetchBreeds,
    staleTime: 0,
    refetchOnWindowFocus: true, // Включаем автоматическое обновление при фокусе на окне
  });

  const handleRefresh = () => {
    setForceRefresh((prev) => prev + 1); // Принудительно обновляем данные
  };

  if (isLoading) {
    return (
      <h1 style={{ textAlign: "center", padding: "20px" }}>
        Загрузка данных о породах...
      </h1>
    );
  }

  if (isError) {
    return (
      <h1 style={{ textAlign: "center", color: "red", padding: "20px" }}>
        Ошибка: {error.message}
      </h1>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#333", marginBottom: "10px" }}>Породы собак</h1>
        <button
          onClick={handleRefresh}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Обновить данные
        </button>
        <button
          onClick={refetch}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Refetch (без изменения ключа)
        </button>
      </div>

      {isFetching && (
        <div
          style={{
            textAlign: "center",
            padding: "10px",
            backgroundColor: "#FF9800",
            color: "white",
            marginBottom: "20px",
          }}
        >
          <h2>Идет фоновое обновление данных...</h2>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {data.data.map((breed) => (
          <div
            key={breed.id}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ marginTop: "0", color: "#2c3e50" }}>
              {breed.attributes.name}
            </h2>
            <p style={{ color: "#555", lineHeight: "1.6" }}>
              {breed.attributes.description}
            </p>

            <div style={{ marginTop: "15px" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Продолжительность жизни:</strong>{" "}
                {breed.attributes.life.min} - {breed.attributes.life.max} лет
              </div>

              <div style={{ marginBottom: "8px" }}>
                <strong>Вес самца:</strong> {breed.attributes.male_weight.min} -{" "}
                {breed.attributes.male_weight.max} кг
              </div>

              <div style={{ marginBottom: "8px" }}>
                <strong>Вес самки:</strong> {breed.attributes.female_weight.min}{" "}
                - {breed.attributes.female_weight.max} кг
              </div>

              <div style={{ marginBottom: "8px" }}>
                <strong>Гипоаллергенная:</strong>{" "}
                {breed.attributes.hypoallergenic ? "Да" : "Нет"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
