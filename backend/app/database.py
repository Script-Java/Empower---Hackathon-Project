from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(), unique=True, nullable=False)
    passwordHash = db.Column(db.String(), nullable=False)
    user_location = db.Column(db.String(), nullable=False)
    items = db.relationship('Item', backref='author', lazy=True)
    admin = db.Column(db.Boolean, default=False)
   
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    item_img = db.Column(db.LargeBinary, nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)