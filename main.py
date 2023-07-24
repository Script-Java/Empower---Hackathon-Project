from flask import Flask, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from wtforms import StringField, PasswordField, SubmitField
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
app.config['SECRET_KEY'] = 'SECRET_KEY_CHANGE_FOR_PRODUCTION'
db = SQLAlchemy(app)

#DATABASE
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    password = db.Column(db.String(), nullable=False)
    user_location = db.Column(db.String(), nullable=False)
    items = db.relationship('Item', backref='items', lasy=True)
   
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)

# TO CREATE THE DB RUN THIS COMMAND
#with app.app_context():
#    db.create_all()

# landing page
@app.route('/')
def index():
    return render_template('index.html')
# Sign Up page
@app.route('/signup')
def signup():
    return render_template('signup.html')
# Login page
@app.route('/login')
def login():
    return render_template('login.html')
# Authorized home page
@app.route('/aindex')
def login():
    return render_template('aindex.html')
# Authorized Dashboard
@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


if __name__ == '__main__':
    app.run(debug=True)