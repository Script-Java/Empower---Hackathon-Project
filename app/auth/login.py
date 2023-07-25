from main import app
from flask import request
import jwt

@app.route('/login', methods=['POST'])
def login():
    print(request.json)
    print(request.json['username'])
    print(request.json['password'])
    if request.json['username'] == 'admin' and request.json['password'] == 'admin':
        return 'OK'
    else:
        return 'ERROR'