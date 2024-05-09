export function drawBoard(white, black, c, tablero, piezas) {////c: context
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let color;
            if ((i + j) % 2 == 0) {
                color = white
            } else {
                color = black
            }
            let sqrSize = canvas.width / 8
            if (tablero[i + j * 8] == 0) {
                c.fillStyle = color
                c.fillRect(i * sqrSize, j * sqrSize, sqrSize, sqrSize)
            } else {
                insertarImagen(i, j, sqrSize, color, c, tablero, piezas)
            }
        }
    }
}

function insertarImagen(x, y, size, bgcolor, c, tablero, piezas) {
    let img = new Image()
    img.src = piezas[tablero[x + y * 8] - 1]
    img.onload = function () {
        c.fillStyle = bgcolor
        c.fillRect(x * size, y * size, size, size)
        c.drawImage(img, x * size, y * size, size, size)
    }
}

export function drawPossible(white, black, c, tablero, piezas, valid) {////le paso el valid<arr> de la pieza que quiero ver
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (valid[i + j * 8] > 0) {
                let color;
                if ((i + j) % 2 == 0) {
                    color = white
                } else {
                    color = black
                }
                let sqrSize = canvas.width / 8
                if (tablero[i + j * 8] == 0) {
                    c.fillStyle = color
                    c.fillRect(i * sqrSize, j * sqrSize, sqrSize, sqrSize)
                    drawCircle(i, j, valid, c, sqrSize)
                } else {
                    insertarImagenCircle(i, j, sqrSize, color, c, tablero, piezas, valid)
                }
                
            }
        }
    }
}

function insertarImagenCircle(x, y, size, bgcolor, c, tablero, piezas,valid) {
    let img = new Image()
    img.src = piezas[tablero[x + y * 8] - 1]
    img.onload = function () {
        c.fillStyle = bgcolor
        c.fillRect(x * size, y * size, size, size)
        c.drawImage(img, x * size, y * size, size, size)
        drawCircle(x, y, valid, c, size)

    }
}

function drawCircle(i, j, valid, c, sqrSize) {
    if (valid[i + j * 8] > 0) {
        if (valid[i + j * 8] == 1) {
            c.strokeStyle = 'blue';
        }
        if (valid[i + j * 8] == 2 || valid[i + j * 8] == 4 || valid[i + j * 8] == 5) {
            c.strokeStyle = 'orange';
        }
        if (valid[i + j * 8] == 3) {
            c.strokeStyle = 'red';
        }
        c.beginPath();
        c.arc((0.5 + i) * sqrSize, (0.5 + j) * sqrSize, sqrSize / 4, 0, Math.PI * 2, false);
        c.stroke();
    }
}

export function translatePiece(posA,num,posB){
    let ret=""
    switch (num) {
        case 1:
            ret ="Torre Blanca"
            break;
        case 2:
            ret = "Torre Negra"
            break;
        case 3:
            ret ="Reina Blanca"
            break;
        case 4:
            ret = "Reina Negra"
            break;
        case 5:
            ret ="Peon Blanco"
            break;
        case 6:
            ret ="Peon Negro"
            break;
        case 7:
            ret ="Rey Blanco"
            break;
        case 8:
            ret ="Rey Negro"
            break;
        case 9:
            ret ="Alfil Blanco"
            break;
        case 10:
            ret = "Alfil Negro"
            break;
        case 11:
            ret = "Caballo Blanco"
            break;
        case 12:
            ret = "Caballo Negro"
            break;
    }

    let x1=translateNumtoLetter(posA[0])
    let x2=translateNumtoLetter(posB[0])
    posA[0]=x1
    posB[0]=x2
    posA[1]=7-posA[1]+1
    posB[1]=7-posB[1]+1
    
    return ret
}

function translateNumtoLetter(num){
    let ret=""
    switch (num) {
        case 0:
            ret ="A"
            break;
        case 1:
            ret ="B"
            break;
        case 2:
            ret = "C"
            break;
        case 3:
            ret ="D"
            break;
        case 4:
            ret = "E"
            break;
        case 5:
            ret ="F"
            break;
        case 6:
            ret ="G"
            break;
        case 7:
            ret ="H"
            break;
    }
    return ret
}
