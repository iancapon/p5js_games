function drawBoard(tablero,white,black) {
    noStroke()
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            fill(white)//fill(255, 211, 202)
            if ((i + j) % 2 == 1) {
                fill(black)//fill(255, 82, 45)
            }
            rect(i * 50, j * 50, 50, 50)
        }
    }
    drawPieces(tablero)
}

function drawPieces(tablero) {
    fill(0)
    textSize(50)//textSize(62)
    textAlign(CENTER,CENTER)
    textFont('Console')
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            text(printPieza(tablero[i * 8 + j]), (j+0.5)*50, (i+0.5)*50)
        } 
    }
}

function printPieza(pieza) {
    switch (pieza) {
        case 0:
            return ""
            break
        case 1:
            return "♖"
            break
        case 2:
            return "♜"
            break
        case 3:
            return "♕"
            break
        case 4:
            return "♛"
            break
        case 5:
            return "♙"
            break
        case 6:
            return "♟"
            break
        case 7:
            return "♔"
            break
        case 8:
            return "♚"
            break
        case 9:
            return "♗"
            break
        case 10:
            return "♝"
            break
        case 11:
            return "♘"
            break
        case 12:
            return "♞"
            break
        default:
            return "-"
            break
    }
}


function drawPossible(valid) {////le paso el valid<arr> de la pieza que quiero ver
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (valid[i + j * 8] > 0) {
                if (valid[i + j * 8] == 1) {
                    stroke(0, 0, 255);
                }
                if (valid[i + j * 8] == 2 || valid[i + j * 8] == 4 || valid[i + j * 8] == 5) {
                    stroke(255, 0, 255)
                }
                if (valid[i + j * 8] == 3) {
                    stroke(255, 0, 0)
                }
                noFill()
                circle((i + 0.5) * 50 , (j + 0.5) * 50, 20)
            }
        }
    }
}



        function translatePiece(posA, num, posB) {
            let ret = ""
            switch (num) {
                case 1:
                    ret = "Torre Blanca"
                    break;
                case 2:
                    ret = "Torre Negra"
                    break;
                case 3:
                    ret = "Reina Blanca"
                    break;
                case 4:
                    ret = "Reina Negra"
                    break;
                case 5:
                    ret = "Peon Blanco"
                    break;
                case 6:
                    ret = "Peon Negro"
                    break;
                case 7:
                    ret = "Rey Blanco"
                    break;
                case 8:
                    ret = "Rey Negro"
                    break;
                case 9:
                    ret = "Alfil Blanco"
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

            let x1 = translateNumtoLetter(posA[0])
            let x2 = translateNumtoLetter(posB[0])
            posA[0] = x1
            posB[0] = x2
            posA[1] = 7 - posA[1] + 1
            posB[1] = 7 - posB[1] + 1

            return ret
        }

        function translateNumtoLetter(num) {
            let ret = ""
            switch (num) {
                case 0:
                    ret = "A"
                    break;
                case 1:
                    ret = "B"
                    break;
                case 2:
                    ret = "C"
                    break;
                case 3:
                    ret = "D"
                    break;
                case 4:
                    ret = "E"
                    break;
                case 5:
                    ret = "F"
                    break;
                case 6:
                    ret = "G"
                    break;
                case 7:
                    ret = "H"
                    break;
            }
            return ret
        }
