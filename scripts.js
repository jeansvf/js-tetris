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
let stoppedPiecesArray = [...Array(boardHeight)].map(e => Array(boardWidth).fill(0))

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
                rotateTetromino()
            break;
        case (event.key == "ArrowRight" || event.key == "d"):
                if (isHittingWall("ArrowRight") || checkHorizontalCollision("ArrowRight")) {
                    return
                }
                eraseTetromino()
                startX++
                drawTetromino()
            break;
        case (event.key == "ArrowDown" || event.key == "s"):
                if (checkVerticalCollision()) {
                    return
                }
                eraseTetromino()
                startY++
                drawTetromino()
            break;
        case (event.key == "ArrowLeft" || event.key == "a"):
                if (isHittingWall("ArrowLeft") || checkHorizontalCollision("ArrowLeft")) {
                    return
                }
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

        gameBoardArray[coordY][coordX] = 1

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

const isHittingWall = (keyPressed) => {
    for(let i=0; i < currentTetromino.length; i++) {
        let coordX = currentTetromino[i][0] + startX
    
        switch(true) {
            case (coordX > 8 && keyPressed == "ArrowRight"): 
                return true
            case (coordX < 1 && keyPressed == "ArrowLeft"):
                return true
        }
    }
}

const checkVerticalCollision = () => {
    let tetrominoCopy = currentTetromino
    let collision = false
    for (let i=0; i < tetrominoCopy.length; i++){
        let square = tetrominoCopy[i]

        let x = square[0] + startX
        let y = square[1] + startY

        // increase y, since the piece is moving downwards
        y++

        // check if the piece is hitting the bottom
        for(let i=0; i < currentTetromino.length; i++) {
            let coordY = currentTetromino[i][1] + startY
            if(coordY == 18) {
                collision = true
                break
            }
        }

        // check if the piece is hitting other piece
        if(!collision) {
            if(gameBoardArray[y+1][x] === 1){
                if(typeof stoppedPiecesArray[y+1][x] == 'string') {
                    collision = true
                    break
                }
            }
        }
    }

    if(collision){
        for (let i=0; i < tetrominoCopy.length; i++){
            let copySquare = tetrominoCopy[i]
            let x = copySquare[0] + startX
            let y = copySquare[1] + startY + 1

            stoppedPiecesArray[y][x] = currentTetrominoColor
            
            // stopTetromino()
        }
        console.log(stoppedPiecesArray);
        
        eraseTetromino()
        startY++
        drawTetromino()

        // TODO: checkForCompleteRow()

        stopTetromino()
    }

    return collision
}

const checkHorizontalCollision = (keyPressed) => {
    let tetrominoCopy = currentTetromino
    let collision = false

    for(let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i]

        let x = square[0] + startX
        let y = square[1] + startY

        keyPressed == "ArrowRight" ? x++ : x--

        // check if the piece is hitting another piece
        if(gameBoardArray[y][x] === 1){
            if(typeof stoppedPiecesArray[y][x] == 'string') {
                collision = true
                break;
            }
        }
    }

    return collision
}

const rotateTetromino = () => {
    let newRotationCord = []
    let tetrominoCopy = currentTetromino
    let currentTetrominoBU = currentTetromino
    for(let i = 0; i < tetrominoCopy.length; i++) {
        let x = tetrominoCopy[i][0]
        let y = tetrominoCopy[i][1]
        let newX = (getLastSquareX() - y)
        let newY = x
        newRotationCord.push([newX, newY])
    }
    eraseTetromino()
    try {
        currentTetromino = newRotationCord
        drawTetromino()
    } catch (e) {
        console.log(e);
        currentTetromino = currentTetrominoBU
        eraseTetromino()
        drawTetromino()
    }
}

const getLastSquareX = () => {
    let lastX = 0
    for (let i = 0; i < currentTetromino.length; i++) {
        let square = currentTetromino[i]
        if(square[0] > lastX) {
            lastX = square[0]
        }
    }
    return lastX
}

const stopTetromino = () => {
    startX = 4
    startY = 0
    createTetromino()
    drawTetromino()
}

createTetromino()
createCoordinatesArray()
drawTetromino()

document.addEventListener('keydown', handleKeyPress)