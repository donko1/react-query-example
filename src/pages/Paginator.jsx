import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

async function fetchCards(page) {
  console.log(page.pageParam);
  const { data } = await axios.get(
    `http://127.0.0.1:5000/cards/${page.pageParam}`
  );
  return data.results || data;
}

export default function PaginationExample() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["cards"],
    queryFn: fetchCards,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.next_page,
    getPreviousPageParam: (lastPage, pages) => lastPage.previous_page,
  });

  const [visibleCards, setVisibleCards] = useState(new Set());

  useEffect(() => {
    if (data) {
      const allCardIds = new Set();
      data.pages.forEach((group) => {
        group.data.forEach((card) => allCardIds.add(card.id));
      });

      const timer = setTimeout(() => {
        setVisibleCards(allCardIds);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [data]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return status === "pending" ? (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ) : status === "error" ? (
    <div className="bg-red-50 p-4 rounded-lg border border-red-200 max-w-md mx-auto mt-8">
      <div className="flex items-center">
        <div className="text-red-400 mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-red-800 font-medium">Ошибка загрузки</h3>
          <p className="text-red-700 text-sm">{error.message}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Проекты</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {data.pages.map((group, i) => (
          <div key={i} className="space-y-6">
            {group.data.map((project) => (
              <div
                key={project.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                  visibleCards.has(project.id)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${(project.id % 10) * 50}ms` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {project.title}
                    </h2>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status === "active"
                        ? "Активный"
                        : project.status === "completed"
                        ? "Завершен"
                        : "В ожидании"}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      ID: {project.id}
                    </span>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-800 font-semibold text-sm">
                        {project.id.toString().slice(-2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            !hasNextPage
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          }`}
        >
          {isFetchingNextPage
            ? "Загрузка..."
            : hasNextPage
            ? "Загрузить еще"
            : "Все проекты загружены"}
        </button>

        {isFetching && !isFetchingNextPage && (
          <div className="flex items-center text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            Обновление...
          </div>
        )}

        {data.pages[0] && (
          <div className="text-sm text-gray-500">
            Показано{" "}
            {data.pages.reduce((total, page) => total + page.data.length, 0)} из{" "}
            {data.pages[0].total} проектов
          </div>
        )}
      </div>
    </div>
  );
}
