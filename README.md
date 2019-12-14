# SnakeGame

# Running the code

1. Create 2 Ubuntu 18.04 cloud instances, make sure to update and upgrade both.
2. Both should have ports 8080 and 5000 open.

## Running backend Flask app
1. SSH into cloud instance designated as backend
2. Install docker and docker-compose
3. git clone this repo
4. $ cd SnakeGame
5. $ sudo docker-compose up

The Flask app should be running on port 5000.

## Running frontend and Express app 
1. SSH into cloud instance designated as frontend machine.
2. $ sudo apt-get install npm
3. git clone this repo
4. $ cd SnakeGame
5. $ npm install
6. $npm run start http://<backend ip address>:<backend app port> (make sure to not have a '/' after the backend app port)

There may be issues with the app, because of the backend docker containers. In that case, stop and delete all containers/images. Refer to steps below to run the backend Flask app without Docker containers.

## Running the backend without Docker
1. SSH into cloud instance designated as backend
2. Install python3 and python3-pip
3. $ pip3 install flask
4. $ pip3 install flask-pymongo
5. git clone this repo
6. $ export FLASK_APP="app.py"
7. $ export FLASK_RUN_HOST="0.0.0.0"
8. $ cd SnakeGame/backend
9. $ flask run