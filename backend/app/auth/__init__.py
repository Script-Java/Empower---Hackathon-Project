from flask import Blueprint, request, jsonify
from database import db, User
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from app import app

auth_bp = Blueprint('auth', __name__)

def createJwt(user: User):
    jwt_info = {
        "sub": user.id,
        "exp": datetime.utcnow() + timedelta(hours=1),
        "nbf": datetime.utcnow(),
        "iat": datetime.utcnow(),
        "usr_name": user.username,
        "iss": "empower.com"
    }
    jwt_token = jwt.encode(jwt_info, app.config["SECRET_KEY"], algorithm="HS256")
    return jwt_token

@auth_bp.route("/signup", methods=["POST", "OPTIONS"])
def signup():
    if request.method == "OPTIONS":
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Max-Age', '86400')
        print("hello")
        return response, 200
    print("Welcome! You have been created")
    admin = False
    try:
        username = request.json["username"]
        # hashing the password
        passwordHash = generate_password_hash(request.json["passwordHash"])
        email = request.json["email"]
        coordinates = request.json["coordinates"]
        max_distance = request.json["max_distance"]
        # checking if the user is admin
        if "admin" in request.json:
            admin = request.json["admin"] == app.config["ADMIN_SECRET"]
    except KeyError as e:

        return "Incorrect JSON" + str(e), 400
    
    user = User(username=username, passwordHash=passwordHash, email=email, coordinates=coordinates, max_distance=max_distance, admin=admin)
    usr_dict = dict(vars(user).items())
    usr_dict.pop("passwordHash")
    usr_dict.pop("_sa_instance_state")
    try:
        db.session.add(user)
        db.session.commit()
        usr_dict["token"] = createJwt(user)
        return jsonify(usr_dict), 200
    except IntegrityError as e:
        return "Username or Email already exists" + str(e), 400
    except Exception as e:
        return f"Failed to connect to database" + str(e), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    user = None
    try:
        username = request.json.get("username")
        password = request.json.get("password")
        email = request.json.get("email")
    except KeyError:
        return jsonify({"message":"Please enter both username and password"}), 400
    if username:
        user = User.query.filter_by(username=username).first()
    elif email:
        user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"message":"Incorrect User"}), 400
    
    if not check_password_hash(user.passwordHash, password):
        return jsonify({"message":"Incorrect password"}), 400
    
    # Generate JWT token with the user information
    
    return jsonify({"token": createJwt(user)})
    
