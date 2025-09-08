from turtle import pos
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

posts = [
    {
        "id": "1",
        "title": "Первый пост",
        "content": "Содержание первого поста",
        "created_at": "2023-01-01T12:00:00",
    }
]


@app.route("/api/posts", methods=["GET"])
def get_posts():
    return jsonify(posts)


@app.route("/api/posts", methods=["POST"])
def create_post():
    try:
        new_post = request.get_json()

        if not new_post.get("title") or not new_post.get("content"):
            return jsonify({"error": "Title and content are required"}), 400

        post = {
            "id": str(uuid.uuid4()),
            "title": new_post["title"],
            "content": new_post["content"],
            "created_at": datetime.now().isoformat(),
        }

        posts.append(post)
        return jsonify(post), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/posts/<post_id>", methods=["DELETE"])
def delete_post(post_id):
    global posts
    posts = [p for p in posts if p["id"] != post_id]
    return jsonify({"message": "Post deleted"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
