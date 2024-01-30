from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(345), unique=True)
    email = db.Column(db.String(120), unique=True) 
    password = db.Column(db.Text, nullable=False)

class FavoriteWorkouts(db.Model):
    __tablename__ = "favorite"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    workout_id = db.Column(db.String(345), unique=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)
    workout_data = db.Column(db.JSON) 

    user = db.relationship('User', backref=db.backref('favorites', lazy=True))