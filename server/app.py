from flask import Flask, request, jsonify, session
import requests
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import ApplicationConfig
from models import db, User,  FavoriteWorkouts

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config.from_object(ApplicationConfig)
db.init_app(app)
app.config.update(SESSION_COOKIE_SAMESITE='Lax')
CORS(app, supports_credentials=True, allow_headers='*')


CORS(app)

with app.app_context():
    db.create_all()

@app.route('/api/exercises', methods=['GET'])
def get_exercises():
    exercise_name = request.args.get('name')
    print(f"Searching for exercise: {exercise_name}")

    url = f"https://exercisedb.p.rapidapi.com/exercises/name/{exercise_name}"
    headers = {
        "X-RapidAPI-Key": "b9c8f46277msh306f918fe1b5791p189976jsne61812f1060f",
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    }
    params = {"limit": "6"}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
       print(e)
       return jsonify({"error": str(e)}), 500
    
@app.route('/user')
def get_user():
    user_id = session.get('user_id')

    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
          "id": user.id,
          "username": user.username,
          "email": user.email,
        })

@app.route('/favorites/<id>', methods=["GET",'POST'])
def user_favorites(id):
      # Adding a recipe to favorites and getting user favorites
    print('working')
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    url = f"https://exercisedb.p.rapidapi.com/exercises/exercise/{id}"
    headers = {
    'X-RapidAPI-Key': '3d5822144bmshfec578309f2bf43p1c3897jsn8cbd24c5a17f',
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
    
    try:
        response = requests.get(url, headers=headers)
        data = response.json() 
        favorite =  FavoriteWorkouts(user_id=user_id, workout_id=id, workout_data=data)
        db.session.add(favorite)
        db.session.commit()
        return jsonify({'message': 'Recipe added to favorites'}), 200
    except requests.RequestException as e:
        return jsonify({'error': str(e)}), 500




@app.route('/favorites', methods=['GET'])
def get_user_favorites():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    favorite_workout = FavoriteWorkouts.query.filter_by(user_id=user_id).all()
    favorites_data = [
        {
            'workout_id': fav.workout_id,
            'workout_data': fav.workout_data  
        }
        for fav in favorite_workout
    ]

    print("Favorites Data:", favorites_data)  # Log the data
    return jsonify({'favorites': favorites_data}), 200




@app.route('/favorites/<int:workout_id>', methods=['DELETE'])
def delete_favorites_workout(workout_id):
    favorite =  FavoriteWorkouts.query.get(workout_id)

    if not favorite:
        return jsonify({'error': 'Favorite recipe not found'}), 404
    
    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({'message': 'Favorite recipe deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500



@app.route('/register', methods=['POST'])
def register_user():

    username = request.json['username']
    email = request.json['email']
    password = request.json['password']

    user_exists = User.query.filter_by(email=email).first()

    if user_exists:
        return jsonify({'message': 'User already exists'}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id
    return jsonify({
        'message': 'User registered successfully',
        'id': new_user.id,
        'email': new_user.email
    }),201


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
    print(email)

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    print("We are working")
    print(user)
    
    session["user_id"] = user.id
    # server_session.set('user_id', user.id)
 
    print(user.id)
    print(type(user.id))

    return jsonify({
        "id": user.id,
        "email": user.email,
        "message": 'all login'
    }), 200

@app.route("/logout", methods=["POST"])
def logout_user():
    if "user_id" in session:  
        session.pop("user_id") 
        return "Logged out successfully", 200
    else:
        return "No user logged in", 401

if __name__ == '__main__':
    app.run(port=3001)
