from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import datetime, os

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/snakeDatabase"
mongo = PyMongo(app)

@app.route('/')
def check():
    return "Flask is up."

@app.route('/user', methods=['POST'])
def create_user():
    data = request.form
    username, password = data.get('username', None), data.get('password', None)
    if not username or not password:
        return jsonify({'error': 'Invalid request'}), 400
    if mongo.db.users.find_one({'username': username}):
        return jsonify({'error': 'Username already in use'}), 400
    mongo.db.users.insert_one({'username': username, 'password': password, 'scores': []})
    return jsonify(data), 201

@app.route('/login', methods=['POST'])
def login_user():
    data = request.form
    username, password = data.get('username', None), data.get('password', None)
    if not username or not password:
        return jsonify({'error': 'Invalid request'}), 400
    user = mongo.db.users.find_one({'username': username})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if password != user['password']:
        return jsonify({'error': 'Wrong password'}), 401
    return jsonify(data), 200
    
@app.route('/user/<username>/scores', methods=['GET'])
def get_user_scores(username):
    if not username:
        return jsonify({'error': 'Invalid request'}), 400
    user = mongo.db.users.find_one({'username': username})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    scores = list()
    for score_id in user['scores']:
        score = mongo.db.scores.find_one({'_id': score_id})
        scores.append({'date': score['date'], 'score': score['score']})
    return jsonify({'scores': scores}), 200

@app.route('/scores/<username>', methods=['POST'])
def create_score(username):
    data = request.get_json()
    if not username or not data or not data.get('score', None):
        return jsonify({'error': 'Invalid request'}), 400
    user = mongo.db.users.find_one({'username': username})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    result = mongo.db.scores.insert_one({'user': user['_id'], 'score': data['score'], 'date': datetime.datetime.now()})
    mongo.db.users.update_one({'username': username}, {'$push': {'scores': result.inserted_id}})
    return jsonify({'score': data['score']}), 201

@app.route('/scores', methods=['GET'])
def get_all_scores():
    dbscores = mongo.db.scores.find({})
    scores = [
        {'username': mongo.db.users.find_one({'_id': score['user']})['username'],
        'score': score['score'],
        'date': score['date']} 
        for score in dbscores]
    scores.sort(key=lambda score: score['score'])
    return jsonify(scores), 200

if __name__ == '__main__':
    app.run(port=5000)