let canvas
let sectors = []
let player = { x: 0, y: 20, z: 0, fov: 60, heading: 0 }
const screenWidth = 800
const screenHeight = 600

function setup() {
  canvas = createCanvas(1500, 900);
  rectMode(CENTER)
  addSector(sectors,0,0,0,5,5,5,color(0,0,200))
  addSector(sectors,12,0,0,10,10,10,color(200,0,0))
  addSector(sectors,-6,0,-3,2,2,2,color(0,200,0))
}

function draw() {
  scale(1.5)
  background(0)
  let distances = []
  sectors.forEach(points => {
    let sc = sectorCenter(points.sector)
    distances.push(distance(sc.x, sc.y, player.x, player.y))
  });
  bubbleSort(sectors, distances)
  for (let i = 0; i < sectors.length; i++) {
    let sc = sectorCenter(sectors[i].sector)
    let p1 = createVector(sc.x - player.x, sc.y - player.y)
    let p2 = createVector(coseno(player.heading % 360) * 10, seno(player.heading % 360) * 10)
    //console.log("::: " +abs(toDegrees(p1.angleBetween(p2))))
    //if (abs(toDegrees(p1.angleBetween(p2)) - 90) < 150) {
      paintSector(player, sectors[i].sector, sectors[i].shade)
    //}

  }
  fill(0)
  rect(900, 500, 200, 200)
  move()
  sectors.forEach(points => {
    topViewOfMap(player, points, 2, 900, 500)
  });
  fill(255, 0, 0)
  circle(screenWidth / 2, 300, 6)
}
function addSector(sectors,x,y,z,u,v,w,shade){
  let p = []
  addPoint(p, x-u/2, y-v/2, z+w/2, z-w/2 )
  addPoint(p, x+u/2, y-v/2, z+w/2, z-w/2 )
  addPoint(p, x+u/2, y+v/2, z+w/2, z-w/2 )
  addPoint(p, x-u/2, y+v/2, z+w/2, z-w/2 )
  sectors.push({sector:p,shade:shade})
}
function sectorCenter(sector) {
  let x = 0
  let y = 0
  sector.forEach(corner => {
    x += corner.x
    y += corner.y
  });
  let len = sector.length
  return { x: x / len, y: y / len }
}
function addPoint(arr, x, y, b, t) {//// LOS PUNTOS SON LINEAS VERTICALES
  let sample = {
    x: x,/// X POS
    y: y,/// Y POS
    t: t,/// TOP POS
    b: b,//// BOTTOM POS
  }
  arr.push(sample) ///// AÑADE PUNTO AL ARRAY DE PUNTOS
}


function pointOnScreen(player, point) {
  let r = rotar(player, point)
  let draw = false///////////////////
  let sx = 0
  let syt = 0
  let syb = 0
  let dx = r.x
  let dy = -r.y
  let angle = toDegrees(atan(dy / dx))
  if (dx < -0.01) {
    angle = 180 + angle
  }
  angle = angle - (player.fov)
  //if ((angle+player.fov)%360<190) {
  draw = true
  sx = screenWidth - angle * screenWidth / player.fov
  syt = -(point.t - player.z) * 1 / dy * 700 + screenHeight / 2
  syb = -(point.b - player.z) * 1 / dy * 700 + screenHeight / 2
  //}
  stroke(255)
  return { xt: sx, yt: syt, xb: sx, yb: syb, draw: draw }
}

function paintSector(player, points, shade) {
  //////////////////////////
  let value = []
  let index = 0
  for (let i = 0; i < points.length; i++) {
    value.push(pointOnScreen(player, points[i]))///// POS DE ESQUINAS EN PANTALLA
    index += 1
  }
  ////////////////////////// 
  let faces = []
  let dist = []
  for (let i = 0; i < index; i++) {//////////// AGRUPO LAS ESQUINAS EN CARAS
    let cornerA = points[i]
    let cornerB = points[(i + 1) % index]
    let sc = { x: (cornerA.x + cornerB.x) / 2, y: (cornerA.y + cornerB.y) / 2 }

    let p1 = createVector(sc.x - player.x, sc.y - player.y)
    let p2 = createVector(coseno(player.heading % 360) * 10, seno(player.heading % 360) * 10)
    let draw = false
    if (abs(toDegrees(p1.angleBetween(p2)) - 90) < 170) {
      draw = true
    }

    faces.push({ cornerA: i, cornerB: (i + 1) % index, draw: draw })
    dist.push(distance(player.x, player.y, (cornerA.x + cornerB.x) / 2, (cornerA.y + cornerB.y) / 2))
  }
  bubbleSort(faces, dist) ////////////LAS ORDENO POR DISTANCIA A LA CAMARA
  ///////////////////////// 
  fill(shade)
  //noStroke()
  for (let i = 0; i < faces.length; i++) {////////////IMPRIMO CARAS
    //if (faces[i].draw) {
      let cornerA = value[faces[i].cornerA]
      let cornerB = value[faces[i].cornerB]
      if (cornerA.draw && cornerB.draw) {
        //
        beginShape()
        vertex(cornerA.xt, cornerA.yt);
        vertex(cornerB.xt, cornerB.yt);
        vertex(cornerB.xb, cornerB.yb);
        vertex(cornerA.xb, cornerA.yb);
        endShape(CLOSE);
      }
    }
  //}
}


function topViewOfMap(player, points, scale, x, y) {
  noStroke()
  fill(0, 255, 0)
  circle(player.x * scale + x, player.y * scale + y, scale * 3)
  fill(255)
  points.sector.forEach(point => {
    circle(scale * point.x + x, scale * point.y + y, scale * 3)
  });
  stroke(255)
  line(-50 * scale + x, -50 * scale + y, 50 * scale + x, -50 * scale + y)
  line(-50 * scale + x, -50 * scale + y, -50 * scale + x, 50 * scale + y)
  line(-50 * scale + x, 50 * scale + y, 50 * scale + x, 50 * scale + y)
  line(50 * scale + x, -50 * scale + y, 50 * scale + x, 50 * scale + y)

  line(player.x * scale + x, player.y * scale + y,
    player.x * scale + x - seno(player.heading) * 10,
    player.y * scale + y - coseno(player.heading) * 10)

}
/////////////////////////////////////////////
////   MISCELANEO

function bubbleSort(arr, dist) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (dist[j] < dist[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        let tempd = dist[j];
        dist[j] = dist[j + 1];
        dist[j + 1] = tempd;
      }
    }
  }
}
function distance(x, y, u, v) {
  return sqrt((x - u) * (x - u) + (y - v) * (y - v))
}
function toDegrees(angle) {
  return (angle * (180 / Math.PI)) % 360;
}
function toRadians(angle) {
  return angle * (Math.PI / 180);
}
function seno(ang) {
  return sin(toRadians(ang))
}
function coseno(ang) {
  return cos(toRadians(ang))
}
function rotar(player, point) {
  let rx = ((point.x - player.x)) * coseno(player.heading) - ((point.y - player.y)) * seno(player.heading)
  let ry = ((point.x - player.x)) * seno(player.heading) + ((point.y - player.y)) * coseno(player.heading)
  return { x: rx, y: ry }
}



let mouseSpeed = 0
function move() {
  if (!mouseIsPressed) {
    mouseSpeed = pmouseX - mouseX
    player.heading += 4 * mouseSpeed / PI
  }
  mouseSpeed = 0

  if (keyIsPressed) {
    if (key == "m" || key == "M") {

    }
    if (key == "w" || key == "W") {
      player.y -= coseno(player.heading)
      player.x -= seno(player.heading)
    }
    if (key == "s" || key == "S") {
      player.y += coseno(player.heading)
      player.x += seno(player.heading)
    }
    if (key == "d" || key == "d") {
      player.y += coseno(player.heading + 90)
      player.x += seno(player.heading + 90)
    }
    if (key == "a" || key == "A") {
      player.y -= coseno(player.heading + 90)
      player.x -= seno(player.heading + 90)
    }
    if (key == "r" || key == "R") {
      player.z += 1
    }
    if (key == "f" || key == "F") {
      player.z -= 1
    }
  }
}




