from main import app
from db import db, User
from flask import request

@app.route("/create_user", methods=["POST"])
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
    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        return "Failed to connect to database", 500