"use strict";

$(document).ready(function() {
    if (window.location.href.includes('?')) {
        let pageUrl = window.location.href.split(`?`);
        if (pageUrl.length === 2) {
            let username = decodeURIComponent(pageUrl[1].split(`=`)[1]);
            $('#optionsLink').attr('href', `/options.html?username=${username}`);
        }
    }
});

var length = 50;
var height = 50;
var grid = [];
var apple = [0, 0];
var dir = [];
var score = 1;
function initializeGame(){
    grid = [];
    apple = [0, 0];
    dir.push(0);
    score = 1;
    for(var i = 0; i < height; i++){
        var temp = [];
        for(var j = 0; j < length; j++){
            temp.push(0);
        }
        grid.push(temp);
    }
    grid[Math.floor(height / 2)][Math.floor(length / 2)] = 1;
    genApple();
}
function genApple(){
    var x, y;
    do {
        y = Math.floor(Math.random() * height);
        x = Math.floor(Math.random() * length);
    } while(grid[y][x] != 0);
    apple[0] = y;
    apple[1] = x;
}

var render_gridLength = 10;
var canvas = document.querySelector('canvas');
canvas.width = 1000
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
function draw(){
    context.fillStyle = '#FFF'
    context.fillRect(length * render_gridLength + 20, 10, 500, 30);
    context.font = '30px Arial';
    context.fillStyle = '#000';
    context.fillText('Score: ' + score, length * render_gridLength + 20, 30 + 10); 
    for(var i = 0; i < height; i++){
        for(var j = 0; j < length; j++){
            if(i == apple[0] && j == apple[1]){
                context.fillStyle = '#050';
            } else if(grid[i][j] > 0){
                context.fillStyle = '#500';
            } else {
                context.fillStyle = '#005';
            }
            context.fillRect(j * render_gridLength, i * render_gridLength, render_gridLength, render_gridLength);
        }
    }
}

var paused = true;
var start_button = document.querySelector("#startbtn");
start_button.addEventListener("click", function() {
    if (paused) {
        start_button.textContent = "Pause";
        start_button.classList.remove("btn-primary");
        start_button.classList.add("btn-danger");
    } else {
        start_button.textContent = "Unpause";
        start_button.classList.remove("btn-danger");
        start_button.classList.add("btn-success");
    }
    paused = !paused;
});
initializeGame();
draw();
window.setInterval(update, 1000/10);
function left(){
    if(dir[dir.length-1] != 1 && dir[dir.length-1] != 3){
        dir.push(3);
    }
}
function up(){
    if(dir[dir.length-1] != 2 && dir[dir.length-1] != 0){
        dir.push(0);
    }
}
function right(){
    if(dir[dir.length-1] != 3 && dir[dir.length-1] != 1){
        dir.push(1);
    }
}
function down(){
    if(dir[dir.length-1] != 0 && dir[dir.length-1] != 2){
        dir.push(2);
    }
}
document.addEventListener('keydown', (e)=>{
    e.preventDefault();
    if(e.keyCode == 37){
        left();
    } else if(e.keyCode == 38){
        up();
    } else if(e.keyCode == 39){
        right();
    } else if(e.keyCode == 40){
        down();
    }
});
function update(){
    if (paused) {
        return;
    }
    var head = [0, 0], tail = [0, 0];
    for(var i = 0; i < height; i++){
        for(var j = 0; j < length; j++){
            if(grid[i][j] > 0){
                if(grid[i][j] == 1){
                    if(dir.length > 1){
                        dir.shift();
                    }
                    if(dir[0] == 0){
                        head[0] = i-1;
                        head[1] = j;
                    } else if(dir[0] == 1){
                        head[0] = i;
                        head[1] = j+1;
                    } else if(dir[0] == 2){
                        head[0] = i+1;
                        head[1] = j;
                    } else {
                        head[0] = i;
                        head[1] = j-1;
                    }
                }
                grid[i][j]++;
                if(grid[i][j] > score){
                    tail[0] = i;
                    tail[1] = j;
                }
            }
        }
    }
    if(head[0] >= height || head[0] < 0 ||
    head[1] >= length || head[1] < 0 ||
    grid[head[0]][head[1]] > 0){
        let scored = score;
        initializeGame();
        paused = true;
        start_button.textContent = "Start";
        start_button.classList.remove("btn-danger");
        start_button.classList.add("btn-primary");
        $.ajax({
            type: 'POST',
            url: '/scores',
            data: {
                score: scored,
            },
            success: () => {
                let msg = document.querySelector('#msg');
                msg.textContent = `Saved score: ${scored}`;
                if (msg.classList.contains('bg-danger')) {
                    msg.classList.remove('bg-danger');
                    msg.classList.add('bg-success');
                }
            },
            error: () => {
                let msg = document.querySelector('#msg');
                msg.textContent = 'Failed to save score';
                if (msg.classList.contains('bg-success')) {
                    msg.classList.remove('bg-success');
                    msg.classList.add('bg-danger');
                }
            },
        });
    } else {
        grid[head[0]][head[1]] = 1;
        if(head[0] == apple[0] && head[1] == apple[1]){
            score++;
            grid[tail[0]][tail[1]] = score;
            genApple();
        } else {
            grid[tail[0]][tail[1]] = 0;
        }
    }
    draw();
}