from flask import Blueprint, request, jsonify
from app.database import db, User
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from app import app

auth_bp = Blueprint('auth', __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    print("Welcome! You have been created")
    admin = False
    try:
        username = request.json["username"]
        # hashing the password
        passwordHash = generate_password_hash(request.json["passwordHash"])
        email = request.json["email"]
        user_location = request.json["user_location"]
        # checking if the user is admin
        if "admin" in request.json:
            admin = request.json["admin"] == app.config["ADMIN_SECRET"]
    except KeyError as e:

        return "Incorrect JSON" + str(e), 400
    
    user = User(username=username, passwordHash=passwordHash, email=email, user_location=user_location, admin=admin)
    usr_dict = dict(vars(user).items())
    usr_dict.pop("passwordHash")
    usr_dict.pop("_sa_instance_state")
    try:
        db.session.add(user)
        db.session.commit()
        return jsonify(usr_dict), 201
    except IntegrityError:
        return "Username or Email already exists", 400
    except Exception as e:
        return f"Failed to connect to database" + str(e), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    user = None
    try:
        username = request.json["username"]
        password = request.json["password"]
    except KeyError:
        return jsonify({"message":"Please enter both username and password"}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({"message":"Incorrect User"}), 400
    
    if not check_password_hash(user.passwordHash, password):
        return jsonify({"message":"Incorrect password"}), 400
    
    # Generate JWT token with the user information
    jwt_info = {
        "sub": user.id,
        "exp": datetime.now() + timedelta(hours=1),
        "nbf": datetime.now(),
        "iat": datetime.now(),
        "usr_name": user.username,
        "iss": "empower.com"
    }
    jwt_token = jwt.encode(jwt_info, "secret", algorithm="HS256")
    return jsonify({"token": jwt_token})
    
