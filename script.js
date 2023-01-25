
let letterI = {
    color: "maroon",
    coords: [[0, 0], [1, 0], [2, 0], [3, 0]],
}

let letterO = {
    color: "fushsia",
    coords: [[0, 0], [0, 1], [1, 0], [1, 1]],
}

let letterL = {
    color: "olive",
    coords: [[0, 0], [1, 0], [2, 0], [2, 1]],
}

let letterJ = {
    color: "teal",
    coords: [[0, 1], [1, 1], [2, 1], [2, 0]],
}

let letterS = {
    color: "aqua",
    coords: [[1, 0], [1, 1], [0, 1], [0, 2]],
}

let letterZ = {
    color: "navy",
    coords: [[0, 0], [0, 1], [1, 1], [1, 2]],
}

let letterT = {
    color: "purple",
    coords: [[0, 0], [0, 1], [0, 2], [1, 1]],
}

let GLOBAL_MATRIX = [];
let DEFAULT_COLOR = "black";
let PIECE_PARAMETERS = [letterT, letterL, letterS, letterJ, letterI, letterO, letterZ];


// Game start

function startGameFunction() {
    createTetrisGrid();
    deleteStartButton();
    gameLoop();
}

function createTetrisGrid() {
    let containerDiv = document.getElementById("tetrisContainerDiv");

    for (let row_ind  = 0; row_ind < 20; row_ind++)
    {
        let row = [];

        for (let col_ind = 0; col_ind < 10; col_ind++)
        {
            let div = document.createElement("div");
            div.classList.add("tetrisBodyDiv");
            div.style.backgroundColor = DEFAULT_COLOR;
            containerDiv.appendChild(div);
            row.push(div);
        }
        GLOBAL_MATRIX.push(row);
    }

}

function deleteStartButton() {
    let startButton = document.getElementById("startGameButton");
    startButton.remove();
}

function tryToPlacePieceAtStart(pieceParam)
{
    let piece = Object.create(pieceParam);
    let col = getRandomInt(10);

    if (canBePlacedInSquare(piece, 0, col)) {
        placePieceOnMatrix(piece, 0, col);
        piece.currentCoord = [0, col];
        return piece;
    }
    return alternativeStartPlacement(pieceParam, piece);
}

function alternativeStartPlacement(pieceParam, piece)
{
    for (let col = 0; col < 10; col++) {
        if (canBePlacedInSquare(piece, 0, col)) {
            placePieceOnMatrix(piece, 0, col);
            piece.currentCoord = [0, col];
            return piece;
        }
    }
    return false;
}

function canBePlacedInSquare(piece, row, col) {
    let coordRow, coordCol, currentColor;
    for (let squareInd = 0; squareInd < piece.coords.length; squareInd++) {
        coordRow = piece.coords[squareInd][0] + row;
        coordCol = piece.coords[squareInd][1] + col;
        if (!areRowAndColInRange(coordRow, coordCol)) {
            return false;
        }
        currentColor = GLOBAL_MATRIX[coordRow][coordCol].style.backgroundColor; 
        if (currentColor != DEFAULT_COLOR) {
            return false;
        }
    }
    return true
}

function placePieceOnMatrix(piece, row, col) {
    let coordRow, coordCol;
    for (let squareInd = 0; squareInd < piece.coords.length; squareInd++) {
        coordRow = piece.coords[squareInd][0] + row;
        coordCol = piece.coords[squareInd][1] + col;
        GLOBAL_MATRIX[coordRow][coordCol].style.backgroundColor = piece.color;
    }
}

function areRowAndColInRange(row, col) {
    let isRowInRange = row >= 0 && row < 20;
    let isColInRange = col >= 0 && col < 10;
    if (isRowInRange && isColInRange){
        return true;
    }
    return false;
}

function makePieceMove(piece) {
    timedFunction(makeOneMove, piece, 100, 22, gameLoop);
}

function makeOneMove(piece) {

    let currentRow = piece.currentCoord[0];
    let currentCol = piece.currentCoord[1];
    let nextRow = currentRow + 1;
    let nextCol = currentCol;

    eraseCurrentOccupiedSpace(piece, currentRow, currentCol);
    if (canBePlacedInSquare(piece, nextRow, nextCol))
    {
        placePieceOnMatrix(piece, nextRow, nextCol);
        piece.currentCoord = [nextRow, nextCol];
        return true;
    }
    placePieceOnMatrix(piece, currentRow, currentCol);
    return false;
}

function eraseCurrentOccupiedSpace(piece, row, col) {
    let coordRow, coordCol;
    for (let squareInd = 0; squareInd < piece.coords.length; squareInd++) {
        coordRow = piece.coords[squareInd][0] + row;
        coordCol = piece.coords[squareInd][1] + col;
        GLOBAL_MATRIX[coordRow][coordCol].style.backgroundColor = DEFAULT_COLOR;
    }
}

function gameLoop() {
    if (isGameOver()) {
        return;
    }
    let pieceParamIndex = getRandomInt(PIECE_PARAMETERS.length);
    let piece = tryToPlacePieceAtStart(PIECE_PARAMETERS[pieceParamIndex]);
    makePieceMove(piece);
}


function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

async function timedFunction(fun, arg, delay, frequency, otherFun) {
    let go_on;
    for (let i = 0; i < frequency; i++){
        await sleep(delay);
        go_on = fun(arg);
        if(!go_on) {
            if (otherFun) {
                otherFun();
            }
            return;
        }
    }
}

function isGameOver() {
    for (square of GLOBAL_MATRIX[0]) {
        if (square.style.backgroundColor != "black") {
            return true;
        }
    }
}

function getRandomInt(range) {
    return Math.floor(Math.random()*range);
}

