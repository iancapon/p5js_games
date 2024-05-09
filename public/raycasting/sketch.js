const PI = 3.14159
let showMap = false
let box = []
const socket = io.connect("/raycasting")
let clients = []

let p = { /////MY DATA
      x: 240,
      y: 240,
      text: "client",
      id: 0,
      mensaje:""
}

function setup() {
      createCanvas(1360, 700);
      rectMode(CENTER)
      fillBoxes()
      socket.on("conectado", (data) => {
            p.id = data.id
      })
}



let heading = -PI / 2
const fov = PI / 3///field of view
const bcount = 120// beam count

let sprite = { x: 4 * 40, y: 4 * 40, text: "😀 ♘ ♞" , mensaje:"texto de prueba     para personaje npc"}
clients.push(sprite)

function draw() {//p
      p.text = document.getElementById("nombre").value
      p.mensaje= document.getElementById("chat").value
      background(192, 239, 255)
      
      stroke(220)
      if (mouseY < 700) {
            keyManaging()
      }
      heading %= (2 * 3.14159)
      const scale = 10000 * 3
      for (let i = 0; i < bcount; i++) {
            const dist = shootBeam(heading - fov / 2 + i * fov / bcount).dist
            const pillarHeight = scale / dist
            fill(255 * (1 - dist / 400))
            //stroke(0,255,0)
            rect((i + 1) * 1360 / bcount, 770 / 2, 1360 / bcount, pillarHeight)
      }
      send()
      recv()
      for (let i = 0; i < clients.length; i++) {
            showSprite(clients[i])
      }
}

function send() {
      socket.emit("clientData", p)
}

function recv() {
      socket.on("clientData", (data) => {
            if (clients.length == 0) {
                  clients.push(data)
            } else {
                  let aux = true
                  for (let i = 0; i < clients.length; i++) {
                        if (clients[i].id == data.id) {
                              clients[i] = data
                              aux = false
                              break
                        }
                  }
                  if (aux) {
                        clients.push(data)
                  }
            }
      })
      socket.on("desconeccion", (data) => {
            for (let i = 0; i < clients.length; i++) {
                  if (clients[i].id == data.id) {
                        clients.splice(i, 1)
                        break
                  }
            }
      })
}

function showSprite(sprite) {
      const dx = p.x - sprite.x
      const dy = p.y - sprite.y
      const dist = sqrt(pow(dx, 2) + pow(dy, 2))
      const sp = createVector(sprite.x - p.x, sprite.y - p.y)
      const pl = createVector(cos(heading - fov / 2), sin(heading - fov / 2))
      const angle = pl.angleBetween(sp)
      const scale = 5000
      const spriteHeight = scale / dist
      const pos = 1350 * angle

      if (shootBeam(sp.heading()).dist > dist) {
            fill(0)
            circle(pos, 770 / 2 - spriteHeight, spriteHeight)
            rect(pos, spriteHeight * 1.1 + 770 / 2, spriteHeight * 2, spriteHeight * 3)
            textSize(spriteHeight / 4)
            fill(255)
            text(sprite.text, pos - spriteHeight / 2.7, spriteHeight / 20 + 770 / 2 - spriteHeight)
            textSize(spriteHeight / 6)
            text(addLineJump(sprite.mensaje), pos - spriteHeight / 1.1, spriteHeight / 20 + 770 / 2 - spriteHeight/6)
            
      }

}

function addLineJump(text){
     // let largo=text.length
     text+=" "
      for(let i=1; i<text.length+1;i++){
            if((i)%20==0){
                  text=text.slice(0,i-1)+"\n"+text.slice(i-1,text.length-1)
            }
      }
      return text
}

let mouseSpeed = 0
function keyManaging() {
      if(!mouseIsPressed){
            mouseSpeed = pmouseX - mouseX
            heading += -0.05 * mouseSpeed / PI
      }

      const speed = 2
      if (keyIsPressed === true) {
            if (keyCode == UP_ARROW || key == "w" || key == "W") {
                  p.x += speed * cos(heading)
                  p.y += speed * sin(heading)
            }
            if (keyCode == DOWN_ARROW || key == "s" || key == "S") {
                  p.x -= speed * cos(heading)
                  p.y -= speed * sin(heading)
            }
            if (keyCode == LEFT_ARROW || key == "a" || key == "A") {
                  p.x -= speed * cos(heading + PI / 2)
                  p.y -= speed * sin(heading + PI / 2)
            }
            if (keyCode == RIGHT_ARROW || key == "d" || key == "D") {
                  p.x += speed * cos(heading + PI / 2)
                  p.y += speed * sin(heading + PI / 2)
            }
      }
}

function shootBeam(alfa) {
      let dist = 10000000000
      let colided = false
      let cx = 0
      let cy = 0
      for (let i = 0; i < 100; i++) {
            if (box[i].check) {
                  let data = colision(box[i], p, alfa)
                  if (data.colision == true && data.dist < dist) {
                        colided = true
                        dist = data.dist
                        cx = data.x
                        cy = data.y
                  }
            }
      }
      if (showMap === true) {
            circle(sprite.x / 2, sprite.y / 2, 10)
            if (colided == true) {
                  line(p.x / 2, p.y / 2, cx / 2, cy / 2)
            }
      }
      return { check: colided, dist: dist }
}

function fillBoxes() {///// llena el array de cajas (el terreno)
      for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                  if (i == 0 || j == 0 || i == 9 || j == 9) {
                        box[i + j * 10] = { x: (i + 1) * 40, y: (j + 1) * 40, l: 40, check: true }
                  }
                  else {
                        box[i + j * 10] = { x: (i + 1) * 40, y: (j + 1) * 40, l: 40, check: false }
                  }
            }
      }
      box[5 + 9 * 10] = { x: (5 + 1) * 40, y: (9 + 1) * 40, l: 40, check: false }
      box[2 + 2 * 10] = { x: (2 + 1) * 40, y: (2 + 1) * 40, l: 40, check: true }
}

function colision(cuad, p, alfa) {/////calculo de colision  (cuadrado, punto y ángulo)
      let Rx1 = cuad.x - cuad.l / 2
      let Rx2 = cuad.x + cuad.l / 2
      let Ry1 = cuad.y - cuad.l / 2
      let Ry2 = cuad.y + cuad.l / 2

      let vert1 = colVert(Rx1, Ry1, Ry2, lineCalc(p, alfa).a, lineCalc(p, alfa).b, p, alfa)
      let vert2 = colVert(Rx2, Ry1, Ry2, lineCalc(p, alfa).a, lineCalc(p, alfa).b, p, alfa)

      let hor1 = colHor(Ry1, Rx1, Rx2, lineCalc(p, alfa).a, lineCalc(p, alfa).b, p, alfa)
      let hor2 = colHor(Ry2, Rx1, Rx2, lineCalc(p, alfa).a, lineCalc(p, alfa).b, p, alfa)

      let colision = false
      let dist = 10000000000
      let posx = 0
      let posy = 0

      if (vert1.check) {
            colision = true
            let d = sqrt(pow(p.x - Rx1, 2) + pow(p.y - vert1.y, 2))
            if (d < dist) {
                  dist = d
                  posx = Rx1
                  posy = vert1.y
            }
      }
      if (vert2.check) {
            colision = true
            let d = sqrt(pow(p.x - Rx2, 2) + pow(p.y - vert2.y, 2))
            if (d < dist) {
                  dist = d
                  posx = Rx2
                  posy = vert2.y
            }
      }
      if (hor1.check) {
            colision = true
            let d = sqrt(pow(p.x - hor1.x, 2) + pow(p.y - Ry1, 2))
            if (d < dist) {
                  dist = d
                  posx = hor1.x
                  posy = Ry1
            }
      }
      if (hor2.check) {
            colision = true
            let d = sqrt(pow(p.x - hor2.x, 2) + pow(p.y - Ry2, 2))
            if (d < dist) {
                  dist = d
                  posx = hor2.x
                  posy = Ry2
            }
      }
      return { colision: colision, dist: dist, x: posx, y: posy }
}

function colHor(ry, e, f, a, b, p, alfa) {//colision horizontal (ry: variable),  e:inicio,  f:fin, a:pendiente,  b:ordenada,  p:punto,  alfa: angulo
      let px = (ry - b) / a
      let cond = false
      let aim = sin(alfa)
      if (px > e && px < f) {
            if (aim > 0 && ry - p.y > 0) {
                  cond = true
            }
            if (aim < 0 && ry - p.y < 0) {
                  cond = true
            }
      }
      let ret = { x: px, check: cond }
      return ret
}
function colVert(rx, e, f, a, b, p, alfa) {//colision vertical (rx: variable),  e:inicio,  f:fin, a:pendiente,  b:ordenada,  p:punto,  alfa: angulo 
      let py = rx * a + b
      let cond = false
      let aim = cos(alfa)
      if (py > e && py < f) {
            if (aim > 0 && rx - p.x > 0) {
                  cond = true
            }
            if (aim < 0 && rx - p.x < 0) {
                  cond = true
            }
      }
      let ret = { y: py, check: cond }
      return ret
}

function lineCalc(p, ang) {//// pendiente y ordenada de origen
      let m = tan(ang)
      let b = p.y - m * p.x
      return { a: m, b: b }
}