let nos
let vos
let botones = []
function setup() {
    createCanvas(400, 700)
    nos = new figura(100, 125+12, 50)
    vos = new figura(250, 125+12, 50)
    botones[0] = new boton(40, 350 - 40, 60, "+", nos)
    botones[1] = new boton(40, 350 + 40, 60, "-", nos)
    botones[2] = new boton(360, 350 + 40, 60, "-", vos)
    botones[3] = new boton(360, 350 - 40, 60, "+", vos)
}
function draw() {
    background(220)
    line(90,100,310,100)
    line(90,350,310,350)
    line(200,40,200,550)
    textSize(30)
    textAlign(CENTER,CENTER)
    text("NOS       VOS",200,80)
    nos.dibujar()
    vos.dibujar()
    botones.forEach(b => {
        b.activar()
    });

}
class boton {
    constructor(x, y, d, text, cont) {
        this.x = x
        this.y = y
        this.d = d///diameter
        this.text = text
        this.state = 0
        this.cont = cont
    }
    activar() {
        if (mouseIsPressed && sqrt(pow(this.x - mouseX, 2) + pow(this.y - mouseY, 2)) < this.d / 2) {
            fill(110, 100)
            this.state = 2
        } else {
            fill(220, 100)
            if (this.state == 1) {
                if (this.text == "+") {
                    this.cont.valor += 1
                }
                if (this.text == "-") {
                    this.cont.valor -= 1
                }
                this.state = 0
            }
            if (this.state == 2) {
                this.state = 1
            }
        }
        circle(this.x, this.y, this.d)
        fill(100)
        textSize(30)
        textAlign(CENTER, CENTER);
        text(this.text, this.x, this.y)
    }
}
class figura {
    constructor(x, y, scale) {
        this.x = x
        this.y = y
        this.scale = scale
        this.valor = 0
    }
    dibujar() {
        if (this.valor < 0) { this.valor = 0 }
        if (this.valor > 30) { this.valor = 30 }
        if (this.valor >= 1) {
            line(this.x, this.y, this.x + this.scale, this.y)
        }
        if (this.valor >= 2) {
            line(this.x, this.y, this.x, this.y + this.scale)
        }
        if (this.valor >= 3) {
            line(this.x + this.scale, this.y, this.x + this.scale, this.y + this.scale)
        }
        if (this.valor >= 4) {
            line(this.x, this.y + this.scale, this.x + this.scale, this.y)
        }
        if (this.valor >= 5) {
            line(this.x, this.y + this.scale, this.x + this.scale, this.y + this.scale)

            let overflow = new figura(this.x, this.y + this.scale * 1.5, this.scale)
            overflow.valor = this.valor - 5
            overflow.dibujar()
        }
        

    }
}