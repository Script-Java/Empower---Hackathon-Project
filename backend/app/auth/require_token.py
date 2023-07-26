from functools import wraps
import jwt
from flask import request
from datetime import datetime
from app.database import User
from app import app

#This is to be used as a function decorator on resources locked for authentication
#It requires a token in the header of the request, and the api endpoint function must have a user as one of the function parameters
#This user will be a User object that is fetched from the database using the token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        #Check if the Authorization header is present
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return {
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }, 401
        try:
            #Use the secret key to decode the token
            data=jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            #get the user from the database using the token's subject
            current_user=User.query.get(data["sub"])
            #If the user is not found, return an error
            if current_user is None:
                return {
                "message": "Invalid Authentication token!",
                "data": None,
                "error": "Unauthorized"
            }, 401
            #If the token is expired, return an error
            if data["exp"] < datetime.utcnow().timestamp():
                return {
                "message": "Token expired!",
                "data": None,
                "error": "Unauthorized"}, 401
        except Exception as e:
            
            return {
                "message": "Something went wrong",
                "data": None,
                "error": str(e)
            }, 500
        # The user is authenticated, pass it to the function
        return f(current_user, *args, **kwargs)

    return decorated