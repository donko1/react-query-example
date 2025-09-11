from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/1", methods=["GET"])
def first_api():
    return jsonify({"detail": "Первый апишка"})


@app.route("/api/2", methods=["GET"])
def second_api():
    return jsonify({"detail": "Вторая апишка"})


@app.route("/api/3", methods=["GET"])
def third_api():
    return jsonify({"detail": "Третья апишка"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
