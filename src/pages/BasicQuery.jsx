import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCharacters = async () => {
  const { data } = await axios.get(
    "https://rickandmortyapi.com/api/charactкer"
  );
  return data.results;
};

const BasicQuery = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["characters"],
    queryFn: fetchCharacters,
    staleTime: 60 * 1000, // Значит, что раз в минуту будет обновляться
    retry: 2, // Количество повторений перед выкидыванием ошибки. Изначально 3
  });

  if (isLoading)
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>🔄 Загрузка персонажей...</h2>
        <p>Идет загрузка данных из мультивселенной Рика и Морти</p>
      </div>
    );

  if (isError)
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
        <h2>❌ Ошибка!</h2>
        <p>{error.message}</p>
        <p>Врикганизатор сломался! Попробуйте позже.</p>
      </div>
    );

  return (
    <div>
      <h2>Basic Query Example</h2>
      <p>Первые 20 персонажей из вселенной Рика и Морти</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {data.map((character) => (
          <div
            key={character.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
          >
            <img
              src={character.image}
              alt={character.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            />

            <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
              {character.name}
            </h3>

            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  backgroundColor:
                    character.status === "Alive"
                      ? "#4caf50"
                      : character.status === "Dead"
                      ? "#f44336"
                      : "#9e9e9e",
                  color: "white",
                }}
              >
                {character.status}
              </span>

              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                }}
              >
                {character.species}
              </span>
            </div>

            <p
              style={{
                margin: "5px 0",
                fontSize: "14px",
                color: "#666",
              }}
            >
              <strong>Пол:</strong> {character.gender}
            </p>

            <p
              style={{
                margin: "5px 0",
                fontSize: "14px",
                color: "#666",
              }}
            >
              <strong>Происхождение:</strong> {character.origin.name}
            </p>

            <p
              style={{
                margin: "5px 0",
                fontSize: "12px",
                color: "#999",
              }}
            >
              Эпизодов: {character.episode.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicQuery;
