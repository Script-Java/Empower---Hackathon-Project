from flask import Blueprint, request
from app.database import db, User
from flask import jsonify
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta
import jwt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/create_user", methods=["POST"])
def create_user():
    print("Hi")
    try:
        username = request.json["username"]
        passwordHash = request.json["passwordHash"]
        email = request.json["email"]
        user_location = request.json["user_location"]
    except KeyError:
        return "Incorrect JSON", 400
    
    user = User(username=username, passwordHash=passwordHash, email=email, user_location=user_location)
    usr_dict = dict(vars(user).items())
    usr_dict.pop("passwordHash")
    usr_dict.pop("_sa_instance_state")
    try:
        db.session.add(user)
        db.session.commit()
        return  jsonify(usr_dict), 201
    except IntegrityError:
        return "Username or Email already exists", 400
    except Exception as e:
        return f"Failed to connect to database" + str(type(e)), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    user = None
    try:
        passwordHash = request.json["passwordHash"]
    except KeyError:
        return "Please enter a password", 400
    if "username" in request.json:
        username = request.json["username"]
        user = User.query.filter_by(username = username).filter_by(passwordHash = passwordHash).first()
    if "email" in request.json:
        email = request.json["email"]
        user = User.query.filter_by(email = email).filter_by(passwordHash = passwordHash).first()
    if user == None:
        return "Incorrect credentials", 400
    
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
    
