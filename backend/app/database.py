from main import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    passwordHash = db.Column(db.String(), nullable=False)
    #Coordinates will be stored as a string in the form of "(lat,lng)" that can be converted to a tuple
    coordinates = db.Column(db.String(), nullable=False)
    #Distance will be stored as an integer in km all items inside the distance will be seen as relevant to the user
    max_distance = db.Column(db.Integer, nullable=False)
    items = db.relationship('Item', backref='author', lazy=True)
    admin = db.Column(db.Boolean, default=False)
   
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    coordinates = db.Column(db.String(), nullable=False)
    img_path = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)