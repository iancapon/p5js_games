const express = require("express")
const { Server } = require("socket.io")
const http = require("http")
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(__dirname +"/public"))

app.get("/chat", (req, res) => {
    res.sendFile("/chat")
})

app.get("/tree", (req, res) => {
    res.sendFile("/tree")
})

app.get("/bool", (req, res) => {
    res.sendFile("/bool")
})

app.get("/ajedrez", (req, res) => {
    res.sendFile("/ajedrez")
})

app.get("/pong", (req, res) => {
    res.sendFile("/pong")
})

app.get("/raycasting", (req, res) => {
    res.sendFile("/raycasting")
})
app.get("/truco", (req, res) => {
    res.sendFile("/truco")
})

app.get("/inicio", (req, res) => {
    res.sendFile("/inicio")
})
app.get("/doom", (req, res) => {
    res.redirect("/doom")
})
app.get("/", (req, res) => {
    res.redirect("/inicio")
})

let rcArray=[]
const rayCasting = io.of("/raycasting")
rayCasting.on("connection", (socket) => {
    console.log("un nuevo cliente en el raycasting")
   // socket.emit("conectado", { id: socket.id })
   socket.on("coneccion",(data)=>{
        rcArray.push({soc:socket, id:data})
        console.log("id:   "+data)

   })
   

    socket.on("clientData", (data) => {
        socket.broadcast.emit("clientData", data)
        //console.log(data)
        for(let i=0; i< rcArray.length;i++){
            if(rcArray[i].id==data.id){
                rcArray[i].soc=socket
                break
            }
        }
    })
    
    socket.on("disconnect", () => {
        for(let i=0; i< rcArray.length;i++){
            if(rcArray[i].soc.id==socket.id){
                //rcArray.splice(i,1)
                let a=rcArray[i].id
                rayCasting.emit("desconeccion", { id: a})
                socket.disconnect()
                rcArray.splice(i,1)
                break
            }
        }
        
        console.log("se fue un cliente")
    })
})

const chess = io.of("/chess")
let games = []
chess.on("connection", (socket) => {
    games.push(socket)
    console.log(`Conectados: ${games.length} jugadores`)
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
