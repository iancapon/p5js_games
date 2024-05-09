const express = require("express")
const { Server } = require("socket.io")
const http = require("http")
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname +"/public"))

app.get("/chat", (req, res) => {
    res.sendFile("/chat")//res.sendFile(path.join(__dirname, 'public','chat'))
})

app.get("/chess", (req, res) => {
    res.sendFile("/chess")//res.sendFile(path.join(__dirname, 'public','chess'))
})

app.get("/pong", (req, res) => {
    res.sendFile("/pong")
})

app.get("/raycasting", (req, res) => {
    res.sendFile("/raycasting")
})

app.get("/", (req, res) => {
    res.redirect("/chess")
})

const rayCasting = io.of("/raycasting")
rayCasting.on("connection", (socket) => {
    console.log("un nuevo cliente en el raycasting")
    socket.emit("conectado", { id: socket.id })

    socket.on("clientData", (data) => {
        socket.broadcast.emit("clientData", data)
        //console.log(data)
    })
    socket.on("disconnect", () => {
        socket.broadcast.emit("desconeccion", { id: socket.id })
        console.log("se fue un cliente")
    })
})

const chess = io.of("/chess")
let games = []
chess.on("connection", (socket) => {
    games.push(socket)
    //console.log(`Conectados: ${games.length}`)
    if (games.length % 2 == 1) {
        socket.emit("control", "white")
        socket.emit("state", "waiting")
    }
    if (games.length % 2 == 0) {
        socket.emit("control", "black")
        socket.emit("state", "connected")
        games[games.length - 2].emit("state", "connected")
    }

    socket.on("disconnect", () => {
        for (let i = 0; i < games.length; i++) {
            if (socket.id == games[i].id) {
                const team = (i+1) % 2
                if (team == 1) {
                    if (i + 1 < games.length) {
                        games[i + 1].emit("state", "disconnected")
                        games[i + 1].disconnect()
                        games.splice(i, 2)
                        //console.log(`Conectados: ${games.length}`)
                    } else {
                        games.splice(i, 1)
                        console.log(`Conectados: ${games.length}`)
                    }
                }
                if (team == 0) {
                    games[i - 1].emit("state", "disconnected")
                    games[i - 1].disconnect()
                    games.splice(i - 1, 2)
                    //console.log(`Conectados: ${games.length}`)
                }
            }
        }
    })

    socket.on("jugada", (data) => {
        for (let i = 0; i < games.length; i++) {
            if (socket.id == games[i].id) {
                const team=(i+1)%2
                if (team == 1) {
                    //console.log(`jugador ${i} envia a jugador ${i+1}`)
                    //console.log(data)
                    games[i + 1].emit("jugada", data)
                }
                if (team == 0 ) {
                    //console.log(`jugador ${i} envia a jugador ${i-1}`)
                    //console.log(data)
                    games[i - 1].emit("jugada", data)
                }
            }
        }
    })

    socket.on("mensaje", (data) => {
        for (let i = 0; i < games.length; i++) {
            if (socket.id == games[i].id) {
                const team=(i+1)%2
                if (team == 1) {
                    games[i + 1].emit("mensaje", data)
                }
                if (team == 0 ) {
                    games[i - 1].emit("mensaje", data)
                }
            }
        }
    })


})


const chatroom = io.of("/chatroom")

let socketList = []
chatroom.on("connection", (socket) => {
    console.log("nuevo cliente")
    socketList.push(socket)
    socket.on("disconnect", () => {
        console.log("se fue un cliente")
        for (let i = 0; i < socketList.length; i++) {
            if (socket.id == socketList[i].id) {
                socketList.splice(i, 1)
                chatroom.emit("clients-count", socketList.length)
                break
            }
        }
    })

    chatroom.emit("clients-count", socketList.length)

    socket.on("mensaje", (data) => {
        console.log(data)
        chatroom.emit("mensaje", data)
    })

})

let PORT = process.env.PORT || 8000
server.listen(PORT, _ => {
    console.log("Escuchando en el puerto " + PORT)
})
