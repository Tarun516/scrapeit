from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import jwt
import datetime
import os
from dotenv import load_dotenv
from app.db.models import User  


load_dotenv()

# Initialize the auth blueprint
auth_blueprint = Blueprint("auth", __name__)
SECRET_KEY=os.getenv("SECRET_KEY")
# Helper function to generate JWT token
def generate_token(user_id):
    token = jwt.encode(
        {
            'user_id': str(user_id),
            'exp': datetime.datetime.now() + datetime.timedelta(hours=24)
        },
        SECRET_KEY,
        algorithm="HS256"
    )
    return token

# Decorator to enforce authentication
def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"message": "Token is missing!"}), 403

        try:
            token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 403

        return f(*args, **kwargs)

    return decorated

# Route for user registration
@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.get_user_by_email(email):
        return jsonify({"message": "Email already exists."}), 409

    hashed_password = generate_password_hash(password)
    user_data = {
        "username": username,
        "email": email,
        "hashed_password": hashed_password,
        "created_at": datetime.datetime.now()
    }
    user_id = User.create_user(user_data).inserted_id

    return jsonify({"message": "User registered successfully.", "user_id": str(user_id)}), 201

# Route for user login
@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.get_user_by_email(email)
    if not user or not check_password_hash(user['hashed_password'], password):
        return jsonify({"message": "Invalid email or password."}), 401

    token = generate_token(user['_id'])
    return jsonify({"message": "Login successful.", "token": token}), 200

# Protected route example
@auth_blueprint.route('/protected', methods=['GET'])
@auth_required
def protected():
    return jsonify({"message": "Access granted to protected route.", "user_id": request.user_id}), 200
