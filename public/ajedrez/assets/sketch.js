let socket;
let mano;
let juego;
let canvas;

let turno = 1
let miEquipo = 0
let estado = ""///////////////////////////////7mal

function setup() {
    canvas = createCanvas(400, 400)
    socket = io("/chess")
    mano = new cursor()
    juego = new board()
    setupTablero(juego.tablero)
    juego.movimientosTotales()
    setupConn()
}

const move_self = new Audio("http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-self.mp3");
const capture = new Audio("http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/capture.mp3")
const error = new Audio('assets/sounds/error.mp3')
const notify = new Audio("http://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/notify.mp3")

const turno_de = document.getElementById("turno-de")
const moves_left = document.getElementById("moves-left")
const jugadas = document.getElementById("sheet")

const chatSheet = document.getElementById("chat-sheet")
const chatButton = document.getElementById("chat-button")
const chatTextarea = document.getElementById("chat-textarea")
const nameTextarea = document.getElementById("name-textarea")

function draw() {
    background(220)
    drawBoard(girarTablero(juego.tablero),color(230),color(150))
    drawPossible(girarTablero(juego.validArray[mano.x + 8 * mano.y]))
    canvas.mouseClicked(manejarClick)
    canvas.mouseMoved(onMouseMove)

    recv()
    //chat()

    if (juego.movesLeft > 0) {
        if (turno == 1) {
            turno_de.textContent = "Turno de: Blancas"
        }
        if (turno == 0) {
            turno_de.textContent = "Turno de: Negras"
        }
        moves_left.textContent = "Movimientos posibles totales: " + juego.movesLeft
    }

    if (juego.movesLeft == 0) {
        if (turno == 1) {
            moves_left.textContent = "Gana: Negras"
        }
        if (turno == 0) {
            moves_left.textContent = "Gana: Blancas"
        }
        turno_de.textContent = "Jaquemate (o empate)"
        notify.play()
        noLoop()
    }
}

function girarTablero(array) {
    let ret = []
    if (miEquipo == 0) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                ret[i + j * 8] = array[(7 - i) + (7 - j) * 8]
            }
        }
    } else {
        for (let i = 0; i < 64; i++) {
            ret[i] = array[i]
        }
    }
    return ret
}
////////////////////////////////////////////// INTERACCION
/////////////////////////////////////////////
function manejarClick() {
    console.log("click")
    if (miEquipo == turno && estado == "connected") {
        let success = mano.click(juego.tablero, juego.turno)
        if (success) {
            let avanza = juego.moverPieza([mano.prevX, mano.prevY], [mano.x, mano.y])
            if (avanza != 0 && avanza != 3) {
                mano.hand = 0
                send()
                turno = juego.turno

                let movimiento = juego.getPieceFromXY(mano.x, mano.y)
                let piece = [mano.prevX, mano.prevY]
                let move = [mano.x, mano.y]
                movimiento = translatePiece(piece, movimiento, move)
                jugadas.innerHTML += "<br>" + (piece[0] + ":" + piece[1] + " - " + movimiento + " -> " + move[0] + ":" + move[1])

                if (avanza == 1 || avanza == 5) {
                    move_self.play()
                }
                if (avanza == 2 || avanza == 4) {
                    capture.play()
                }
            } else {
                error.play()
            }
            
        }
    }
}
function onMouseMove() {
    mano.truex = Math.floor(mouseX / 50)
    mano.truey = Math.floor(mouseY / 50)
    if (miEquipo == 0) {
        mano.truex = 7 - mano.truex
        mano.truey = 7 - mano.truey
    }
}

///////////////////////////////////////////////////// CONECCION
/////////////////////////////////////////////////////

function setupConn() {
    socket.on("control", (data) => {
        if (data == "white") {
            miEquipo = 1
            document.getElementById("mi-equipo").innerHTML = "Juego con Blancas"
        }
        if (data == "black") {
            miEquipo = 0
            document.getElementById("mi-equipo").innerHTML = "Juego con Negras"
        }
    })
    socket.on("state", (data) => {
        document.getElementById("estado").innerHTML = data + "..."
        estado= data
    })
}



function recv() {
    socket.on("jugada", (data) => {
        if (miEquipo != turno) {
            let avanza = juego.moverPieza([data.px, data.py], [data.x, data.y])
            if (avanza != 0 && avanza != 3) {
                turno = juego.turno

                let movimiento = juego.getPieceFromXY(data.x, data.y)
                let piece = [data.px, data.py]
                let move = [data.x, data.y]
                movimiento = translatePiece(piece, movimiento, move)
                jugadas.innerHTML += "<br>" + (piece[0] + ":" + piece[1] + " - " + movimiento + " -> " + move[0] + ":" + move[1])

                if(avanza==1||avanza==5){
                    move_self.play()
                }
                if(avanza==2||avanza==4){
                    capture.play()
                }
            }
            else {
                error.play()
            }
        }
    })
    socket.on("state", (data) => {
        document.getElementById("estado").innerHTML = data + "..."
        estado= data
    })

    socket.on("mensaje", (data) => {
        const pub = document.createElement("li")
        pub.innerText = data
        chatSheet.appendChild(pub)
    })
}

function send() {
    let data = {
        px: mano.prevX,
        py: mano.prevY,
        x: mano.x,
        y: mano.y
    }
    socket.emit("jugada", data)
}

/////////////////////////////////////////////


////////////////////////////
/////////////////////////// CHAT 
let aux=0
function chat(){

    chatButton.addEventListener("click", () => {
        if (estado == "connected") {
            socket.emit("mensaje", nameTextarea.value + "::" + chatTextarea.value)
            const pub = document.createElement("li")
            pub.innerText = nameTextarea.value + "::" + chatTextarea.value
            chatSheet.appendChild(pub)
            chatTextarea.value = ""
        }
    })
    chatTextarea.addEventListener("keydown", (event) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault()
            if (estado == "connected") {
                socket.emit("mensaje", nameTextarea.value + "::" + chatTextarea.value)
                const pub = document.createElement("li")
                pub.innerText = nameTextarea.value + "::" + chatTextarea.value
                chatSheet.appendChild(pub)
                chatTextarea.value = ""
            }
        }
    })

}
//////////////////////////////////
/////////////////////////////////