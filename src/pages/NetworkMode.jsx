// src/pages/NetworkMode.jsx
import { useState, useEffect } from "react";
import { useQuery, onlineManager } from "@tanstack/react-query";

// Обновленная mockApiCall
const mockApiCall = async () => {
  // Проверяем состояние сети через onlineManager
  const isOnline = onlineManager.isOnline();

  if (!isOnline) {
    throw new Error("Network error: You are offline");
  }

  // Имитируем задержку сети
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Имитируем случайные ошибки (только когда онлайн)
  if (Math.random() > 0.3) {
    return { data: `Success! Random number: ${Math.random().toFixed(4)}` };
  } else {
    throw new Error("API request failed (server error)");
  }
};

// Компонент для демонстрации каждого режима сети
const QueryDemo = ({ mode, title, description }) => {
  const [count, setCount] = useState(0);

  const { data, error, status, fetchStatus, isFetching, isPaused, refetch } =
    useQuery({
      queryKey: [mode, count],
      queryFn: mockApiCall,
      networkMode: mode,
      retry: 2,
      retryDelay: 1000,
    });

  return (
    <div className="mode-card">
      <div className="mode-title">{title}</div>
      <p>{description}</p>

      <div className="query-status">
        State: <strong>{status}</strong>
      </div>
      <div className="fetch-status">
        Fetch Status: <strong>{fetchStatus}</strong>
      </div>
      <div>
        {isFetching && "Fetching..."}
        {isPaused && "Paused (offline)"}
      </div>

      <div className="status">
        {status === "loading" && <p>Loading...</p>}
        {status === "error" && <p className="error">Error: {error.message}</p>}
        {status === "success" && <p className="success">Data: {data.data}</p>}
      </div>

      <button onClick={() => setCount((c) => c + 1)} disabled={isFetching}>
        {isFetching ? "Fetching..." : "Refetch"}
      </button>
    </div>
  );
};

// Основной компонент страницы
const NetworkMode = () => {
  const [isOnline, setIsOnline] = useState(onlineManager.isOnline());

  // Переключение онлайн/оффлайн состояния
  const toggleNetwork = () => {
    onlineManager.setOnline(!onlineManager.isOnline());
    setIsOnline(onlineManager.isOnline());
  };

  // Обновление UI при изменении сетевого статуса
  useEffect(() => {
    const unsubscribe = onlineManager.subscribe(() => {
      setIsOnline(onlineManager.isOnline());
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="network-mode-page">
      <h1>React Query Network Modes Demo</h1>

      <div className="controls">
        <div>
          Network Status:
          <span className={`network-status ${isOnline ? "online" : "offline"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
        <button onClick={toggleNetwork}>
          Go {isOnline ? "Offline" : "Online"}
        </button>
      </div>

      <div className="container">
        <QueryDemo
          mode="online"
          title="Online Mode"
          description="Запросы выполняются только при наличии сетевого соединения. При отсутствии сети запросы приостанавливаются."
        />

        <QueryDemo
          mode="always"
          title="Always Mode"
          description="Запросы выполняются всегда, независимо от сетевого статуса. Подходит для операций с локальным хранилищем."
        />

        <QueryDemo
          mode="offlineFirst"
          title="Offline First Mode"
          description="Первая попытка выполняется, но повторные попытки приостанавливаются при отсутствии сети. Идеально для PWA."
        />
      </div>

      <div className="explanation">
        <h3>Как использовать:</h3>
        <ol>
          <li>Нажмите "Go Offline", чтобы имитировать отключение сети</li>
          <li>
            Нажмите "Refetch" на каждой карточке, чтобы увидеть разное поведение
          </li>
          <li>
            Обратите внимание на состояние (State) и статус fetching (Fetch
            Status)
          </li>
          <li>
            Вернитесь онлайн и посмотрите, как запросы продолжают выполняться
          </li>
        </ol>

        <h3>Разъяснение режимов:</h3>
        <ul>
          <li>
            <strong>Online</strong>: Запросы приостанавливаются при отсутствии
            сети, затем продолжаются
          </li>
          <li>
            <strong>Always</strong>: Запросы выполняются всегда, игнорируя
            сетевой статус
          </li>
          <li>
            <strong>OfflineFirst</strong>: Первая попытка выполняется, но
            повторные приостанавливаются без сети
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NetworkMode;
