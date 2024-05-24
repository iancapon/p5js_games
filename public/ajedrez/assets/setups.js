

function setupTablero( tablero) {
    for (let i = 0; i < 64; i++) {
        tablero[i] = 0
    }

    for (let i = 0; i < 8; i++) {
        let j = 1
        tablero[i + j * 8] = 5 + 1
        j = 6
        tablero[i + j * 8] = 4 + 1
    }

    tablero[0] = 1 + 1;
    tablero[7] = 1 + 1;
    tablero[0 + 7 * 8] = 0 + 1;
    tablero[7 + 7 * 8] = 0 + 1;
    tablero[1] = 11 + 1;
    tablero[6] = 11 + 1;
    tablero[1 + 7 * 8] = 10 + 1;
    tablero[6 + 7 * 8] = 10 + 1;
    tablero[2] = 9 + 1;
    tablero[5] = 9 + 1;
    tablero[2 + 7 * 8] = 8 + 1;
    tablero[5 + 7 * 8] = 8 + 1;
    tablero[3] = 3 + 1;
    tablero[4] = 7 + 1;
    tablero[3 + 7 * 8] = 2 + 1;
    tablero[4 + 7 * 8] = 6 + 1;
}