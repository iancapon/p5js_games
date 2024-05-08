function setup() {
  createCanvas(800, 600);
  rectMode(CENTER)
}
//let startV = { x: 3, y: 0 }
let V = p5.Vector.random2D()
V.mult(8)
let ball = { x: 400, y: 300, v:V, r: 8 }
let p1 = { x: 50, y: 300, w: 10, h: 70, u: 0, v: 0 }
let p2 = { x: 750, y: 300, w: 10, h: 70, u: 0, v: 0 }

function draw() {
  background(0);
  court()
  fill(255)
  ballPhysics()
  movePaddle(p2)
  bot(p1)
  rect(p1.x, p1.y, p1.w, p1.h)
  rect(p2.x, p2.y, p2.w, p2.h)
  collideWithPaddle(p1)
  collideWithPaddle(p2)
  rect(ball.x, ball.y, 2 * ball.r)
  //console.log("heading: "+ball.v.heading())
}

function bot(paddle){
  let dx = ball.x - paddle.x
  let dy = ball.y - paddle.y
  if(abs(dx)<200){
    if(dy<0){
      paddle.v=-5
    }
    else if(dy>0){
      paddle.v=5
    }
    
  }else{
    paddle.v=0
  }
  paddle.y += paddle.v
}

function collideWithPaddle(paddle) {

  let cx = ball.r + paddle.w / 2
  let cy = ball.r + paddle.h / 2
  let dx = ball.x - paddle.x
  let dy = ball.y - paddle.y
  if (abs(dy) < cy) {
    if (abs(dx) < cx) {
      ball.v.x *= -1
      
      if(abs(dy) > cx/2 && ((ball.v.y<0 && dy>0) || (ball.v.y>0 && dy<0))){
        ball.v.y*=-1
      }
      /*
      let ang=ball.v.heading()
      if(abs(dy) > cx/2 ){
        //ball.v.y*=-1
        if(ball.v.y<0 && dy>0){}
        
      }*/
    }
  }
}

  function movePaddle(paddle) {
    if (keyIsPressed === true) {
      if (keyCode === UP_ARROW) {
        paddle.v = -5
      } else if (keyCode === DOWN_ARROW) {
        paddle.v = 5
      }
    } else {
      paddle.v = 0
    }
    paddle.y += paddle.v
  }

  function ballPhysics() {
    ball.x += ball.v.x
    ball.y += ball.v.y
    if (ball.x - ball.r < 10 || ball.x + ball.r > 790) {
      if (abs(ball.y - 300 - ball.r) > 150) {
        ball.v.x *= -1
      } else {
        ball.v.x = 0
        ball.v.y = 0
        fill(255, 0, 0)
      }
    }
    if (ball.y - ball.r < 5 || ball.y + ball.r > 595) {
      ball.v.y *= -1
    }
  }

  function court() {
    fill(255)
    rect(400, 300, 800 - 10, 600 - 10)
    fill(0)
    rect(200 + 7, 300, 400 - 20, 600 - 20)
    rect(600 - 7, 300, 400 - 20, 600 - 20)
    rect(11, 300, 10, 300)
    rect(800 - 11, 300, 10, 300)
  }