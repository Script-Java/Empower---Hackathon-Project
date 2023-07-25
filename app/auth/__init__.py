from flask import Blueprint, request
from app.database import db, User
from flask import jsonify

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
    print(usr_dict)
    
    try:
        db.session.add(user)
        db.session.commit()
        return  jsonify(usr_dict), 201
    except Exception as e:
        return f"Failed to connect to database" + str(e), 500

@auth_bp.route("/test", methods=["GET"])
def test():
    return "Hi"