const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const boardWidth = 10
const boardHeight = 20

let tetrominos = [
    // T 
    [[1,0], [0,1], [1,1], [2,1]],
    // I
    [[0,0], [1,0], [2,0], [3,0]],
    // J
    [[0,0], [0,1], [1,1], [2,1]],
    // Square
    [[0,0], [1,0], [0,1], [1,1]],
    // L
    [[2,0], [0,1], [1,1], [2,1]],
    // S
    [[1,0], [2,0], [0,1], [1,1]],
    // Z
    [[0,0], [1,0], [1,1], [2,1]],
]

let coordinatesArray = [...Array(boardHeight)].map(e => Array(boardWidth).fill(0))

let startX = 0
let startY = 0

let tetrominoColors = ['white', 'blue', 'purple', 'green', 'cyan', 'yellow', 'pink']
let currentTetromino;
let currentTetrominoColor;

let gameBoardArray = [...Array(boardHeight)].map(e => Array(boardWidth).fill(0))

const tetrominoSize = 30

const createCoordinatesArray = () => {
    let width = 0, height = 0

    for(let y=10; y < 620 - tetrominoSize; y += tetrominoSize) {
        for(let x=10; x < 320 - tetrominoSize; x += tetrominoSize) {
            coordinatesArray[width][height] = {x: x, y: y}
            width++
        }
        height++
        width=0
    }
}

const handleKeyPress = (event) => {
    switch (true) {
        case (event.key == "ArrowUp" || event.key == "w"):
                // eraseTetromino()
                // startY--
                // drawTetromino()
            break;
        case (event.key == "ArrowRight" || event.key == "d"):
                eraseTetromino()
                startX++
                drawTetromino()
            break;
        case (event.key == "ArrowDown" || event.key == "s"):
                eraseTetromino()
                startY++
                drawTetromino()
            break;
        case (event.key == "ArrowLeft" || event.key == "a"):
                eraseTetromino()
                startX--
                drawTetromino()
            break;
    }
}

const drawTetromino = () => {
    ctx.fillStyle = currentTetrominoColor
    for(let i=0; i < currentTetromino.length; i++) {
        let coordX = currentTetromino[i][0] + startX
        let coordY = currentTetromino[i][1] + startY

        // if gameboard location exists && has a value of 0

        gameBoardArray[coordY][coordX] = 1
        
        console.log(gameBoardArray);
        console.log(coordY);

        ctx.fillRect(coordinatesArray[coordX][coordY].x, coordinatesArray[coordX][coordY].y, tetrominoSize, tetrominoSize)
    }
}

const eraseTetromino = () => {
    ctx.fillStyle = "black"
    for(let i=0; i < currentTetromino.length; i++) {
        let coordX = currentTetromino[i][0] + startX
        let coordY = currentTetromino[i][1] + startY

        gameBoardArray[coordY][coordX] = 0

        ctx.fillRect(coordinatesArray[coordX][coordY].x, coordinatesArray[coordX][coordY].y, tetrominoSize, tetrominoSize)
    }
}

const createTetromino = () => {
    currentTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)]
    currentTetrominoColor = tetrominoColors[Math.floor(Math.random() * tetrominoColors.length)]
}

document.write(JSON.stringify(gameBoardArray))

createTetromino()
createCoordinatesArray()
drawTetromino()

document.addEventListener('keydown', handleKeyPress)