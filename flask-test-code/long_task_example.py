from flask import Flask, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)  # Включение CORS


@app.route("/long-task")
def long_task():
    try:
        # Имитация долгой задачи (10 секунд)
        for i in range(10):
            time.sleep(1)
            print(f"Progress: {i + 1}/10")
    except KeyboardInterrupt:
        # Обработка прерывания запроса
        print("Запрос отменен!")
        return jsonify({"status": "canceled"})

    return jsonify({"status": "completed", "data": "Результат задачи"})


if __name__ == "__main__":
    app.run(debug=True)
