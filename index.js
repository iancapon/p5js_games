const express = require("express")
const { createServer } = require("http")
const path = require("path")
const { Server } = require("socket.io")

const app = express()
const server = createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname, "public")))

app.get("/pong", (req, res) => {
    res.sendFile("/pong")
    console.log("pong")
})

app.get("/raycasting", (req, res) => {
    res.sendFile("/raycasting")
    console.log("raycasting")
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

let PORT = 3000
server.listen(PORT, () => {
    console.log("Escuchando en el puerto " + PORT)
})