from flask_cors import CORS


from werkzeug.security import generate_password_hash, check_password_hash

from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
CORS(app)


# ---------- DATABASE FUNCTION ----------
def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

# ---------- CREATE TABLE (RUN ONCE) ----------
@app.route("/create-table")
def create_table():
    conn = get_db_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    """)
    conn.commit()
    conn.close()
    return "Users table created"


# ---------- HOME ----------
@app.route("/")
def home():
    return "Backend is running"

# ---------- REGISTER API ----------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    hashed_password = generate_password_hash(password)

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        (name, email, hashed_password)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "User registered successfully"})

# ---------- GET USERS API ----------
@app.route("/users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    users = conn.execute(
        "SELECT id, name, email FROM users"
    ).fetchall()
    conn.close()

    users_list = []
    for user in users:
        users_list.append({
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        })

    return jsonify(users_list)

    
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    user = conn.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()
    conn.close()

    if user is None:
        return jsonify({"message": "User not found"}), 404

    if check_password_hash(user["password"], password):
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        })

    return jsonify({"message": "Invalid password"}), 401
    



if __name__ == "__main__":
    app.run(debug=True)

