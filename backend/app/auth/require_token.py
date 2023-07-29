from functools import wraps
import jwt
from flask import request
from datetime import datetime
from database import User
from main import app
from flask_headers import headers

#This is to be used as a function decorator on resources locked for authentication
#It requires a token in the header of the request, and the api endpoint function must have a user as one of the function parameters
#This user will be a User object that is fetched from the database using the token




def token_required_unwrapped(f):
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
        # In case of any other error, return an error
        except Exception as e:
            
            return {
                "message": "Something went wrong",
                "data": None,
                "error": str(e)
            }, 500
        #Check if the user is authorized to access the resource in the keyword arguments(kwargs)
        #If requireAdmin is present, check if the user is an admin, if not, return an error
        if "requireAdmin" in kwargs:
            if current_user.admin != kwargs["requireAdmin"]:
                return {
                    "message": "Unauthorized",
                    "data": None,
                    "error": "Unauthorized"
                }, 401
        # The user is authenticated, pass it to the function
        return f(current_user, *args, **kwargs)

    return decorated

def token_required(f):
    return headers({"Access-Control-Allow-Headers" : "Authorization"})(token_required_unwrapped(f))