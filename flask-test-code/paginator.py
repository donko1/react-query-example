from flask import Flask, jsonify
from flask_cors import CORS
from math import ceil
import random

app = Flask(__name__)
CORS(app)


def generate_fake_cards(total=100):
    titles = ["Проект", "Исследование", "Эксперимент", "Анализ", "Отчет"]
    descriptions = [
        "Важный этап разработки",
        "Перспективное направление",
        "Инновационный подход",
        "Структурное исследование",
        "Детальный разбор задачи",
    ]

    cards = []
    for i in range(1, total + 1):
        cards.append(
            {
                "id": i,
                "title": f"{random.choice(titles)} #{i}",
                "description": f"{random.choice(descriptions)} {random.randint(1, 100)}",
                "status": random.choice(["active", "completed", "pending"]),
            }
        )
    return cards


ALL_CARDS = generate_fake_cards(500)
PER_PAGE = 10


@app.route("/cards/<int:page>/", methods=["GET"])
def get_cards(page):
    try:
        if page < 1:
            return jsonify({"error": "Page number must be positive"}), 400

        start_idx = (page - 1) * PER_PAGE
        end_idx = start_idx + PER_PAGE

        paginated_cards = ALL_CARDS[start_idx:end_idx]

        total_pages = ceil(len(ALL_CARDS) / PER_PAGE)

        next_page = f"{page + 1}/" if page < total_pages else None
        previous_page = f"{page - 1}/" if page > 1 else None

        return jsonify(
            {
                "page": page,
                "per_page": PER_PAGE,
                "total": len(ALL_CARDS),
                "total_pages": total_pages,
                "next_page": next_page,
                "previous_page": previous_page,
                "data": paginated_cards,
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/cards/", methods=["GET"])
def get_first_page():
    return get_cards(1)


if __name__ == "__main__":
    app.run(debug=True)
