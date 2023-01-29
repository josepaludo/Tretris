
let letterI = {
    color: "maroon",
    coords: [[0, 0], [1, 0], [2, 0], [3, 0]],
}

let letterO = {
    color: "green",
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

const DEFAULT_COLOR = "black";
const PIECE_PARAMETERS = [letterT, letterL, letterS, letterJ, letterI, letterO, letterZ];
let DELAY = 500;
let CONTINUE_TIMER = true;
let BACK_TRACK, GAME_OVER_SOUND, NEW_SHAPE_SOUND;
let GLOBAL_MATRIX = [];
let DIRECTION = 0;
let TOTAL_PIECES = 0;
let TOTAL_POINTS = 0;
let MS = 0;
let SS = 0;
let MM = 0;
let TIME;


function startGameFunction() {
    createTetrisGrid();
    deleteStartElements();
    listenToArrows();
    addAudio();
    showStatusDiv();
    tikTimer();
    gameLoop();
}

function createTetrisGrid() {
    let containerDiv = document.getElementById("tetrisContainerDiv");
    let row, div;

    containerDiv.style.display = "grid";

    for (let row_ind  = 0; row_ind < 20; row_ind++)
    {
        row = [];
        for (let col_ind = 0; col_ind < 10; col_ind++)
        {
            div = document.createElement("div");
            div.classList.add("tetrisBodyDiv");
            div.style.backgroundColor = DEFAULT_COLOR;
            containerDiv.appendChild(div);
            row.push(div);
        }
        GLOBAL_MATRIX.push(row);
    }

}

function deleteStartElements() {
    document.getElementById("divToBeDeleted").style.display = "none";
    document.getElementById("startAndEndUL").remove();
    document.getElementById("startGameButton").remove();
}

function tryToPlacePieceAtStart(pieceParam)
{
    let piece = Object.create(pieceParam);
    let col = 1+getRandomInt(6);

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
}

function makePieceMove(piece) {
    DELAY *= 0.99;
    timedFunction(makeOneMove, piece, DELAY, 22, gameLoop);
}

function makeOneMove(piece)
{
    switch (DIRECTION) {
        case 0:
            return checkDestinationAndMakeMove(piece, 0, false);
        case 1:
            return checkDestinationAndMakeMove(piece, -1, true);
        case 2:
            return checkDestinationAndMakeMove(piece, 1, true);
        case 3:
            return rotateAndMove(piece);
        case 4:
            return moveDownTwice(piece);
    }
}

function checkDestinationAndMakeMove(piece, colAdd, isFirstTry, isRotation=false)
{
    DIRECTION = 0;
    let currentRow = piece.currentCoord[0];
    let currentCol = piece.currentCoord[1];
    let nextRow = currentRow + 1;
    let nextCol = currentCol + colAdd;

    eraseCurrentOccupiedSpace(piece, currentRow, currentCol);
    if (canBePlacedInSquare(piece, nextRow, nextCol))
    {
        placePieceOnMatrix(piece, nextRow, nextCol);
        piece.currentCoord = [nextRow, nextCol];
        return true;
    }
    if (!isRotation) {
        placePieceOnMatrix(piece, currentRow, currentCol);
    }
    let stop = false;
    if (isFirstTry) {
        stop = checkDestinationAndMakeMove(piece, 0, false);
    }
    return stop;
}

function eraseCurrentOccupiedSpace(piece, row, col) {
    let coordRow, coordCol;
    for (let squareInd = 0; squareInd < piece.coords.length; squareInd++) {
        coordRow = piece.coords[squareInd][0] + row;
        coordCol = piece.coords[squareInd][1] + col;
        GLOBAL_MATRIX[coordRow][coordCol].style.backgroundColor = DEFAULT_COLOR;
    }
}

function rotateAndMove(piece) {
    let currentRow = piece.currentCoord[0];
    let currentCol = piece.currentCoord[1];

    let currentCoords = [];
    Object.assign(currentCoords, piece.coords);
    eraseCurrentOccupiedSpace(piece, currentRow, currentCol);

    piece.coords = getRotatedCoords(piece);

    if (canBePlacedInSquare(piece, currentRow, currentCol)) {
        if (checkDestinationAndMakeMove(piece, 0, false, true)) {
            return true;
        }
    }
    piece.coords = currentCoords;
    return checkDestinationAndMakeMove(piece, 0, false);
}

function getRotatedCoords(piece) {
    let rotatedCoord;
    let rotatedCoords = [];
    for (coord of piece.coords) {
        // maybe error
        rotatedCoord = [coord[1], -coord[0]]
        rotatedCoords.push(rotatedCoord);
    }
    return rotatedCoords;
}

function moveDownTwice(piece) {
    if (checkDestinationAndMakeMove(piece, 0, false)) {
    return checkDestinationAndMakeMove(piece, 0, false);
    }
}

function gameLoop() {
    if (isGameOver()) {
        endGameFunction();
        return;
    }
    TOTAL_PIECES += 1;

    checkForCompletedLines();

    let pieceParamIndex = getRandomInt(PIECE_PARAMETERS.length);
    let piece = tryToPlacePieceAtStart(PIECE_PARAMETERS[pieceParamIndex]);

    NEW_SHAPE_SOUND.play();

    updateStatus();

    makePieceMove(piece);
}



async function timedFunction(fun, arg, delay, frequency, otherFun) {
    let go_on;

    for (let i = 0; i < frequency; i++){

        await sleep(delay);
        go_on = fun(arg);

        if(!go_on) {
            return otherFun();
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

function listenToArrows() {
    document.onkeydown = (e) => {
        e = e || window.event;

        switch (e.keyCode) {
            case 37:
            case 65:
                DIRECTION = 1;
                break;
            case 38:
            case 87:
                DIRECTION = 3;
                break;
            case 39:
            case 68:
                DIRECTION = 2;
                break;
            case 40:
            case 83:
                DIRECTION = 4;
                break;
        }
    }
}

function checkForCompletedLines() {
    for (let index = GLOBAL_MATRIX.length-1; index > 0; index--) {
        if (lineHasEmptySquare(index)) {
            continue;
        }
        TOTAL_POINTS += 10;
        clearLineByIndex(index);
    }
}

function lineHasEmptySquare(index) {
    for (square of GLOBAL_MATRIX[index]) {
        if (square.style.backgroundColor === DEFAULT_COLOR) {
            return true;
        }
    }
}

function clearLineByIndex(currentRowIndex) {
    let lastRowColor;
    for (let index = currentRowIndex; index > 0; index--) {
        for (let innerInd = 0; innerInd < 10; innerInd++) {
            lastRowColor = GLOBAL_MATRIX[index-1][innerInd].style.backgroundColor;
            GLOBAL_MATRIX[index][innerInd].style.backgroundColor = lastRowColor;
        }
    }
}

function addAudio() {
    BACK_TRACK = new Audio("assets/beat.m4a");
    BACK_TRACK.loop = true;
    BACK_TRACK.volume *= 0.4;
    BACK_TRACK.play();

    NEW_SHAPE_SOUND = new Audio("assets/newshape.wav");
    NEW_SHAPE_SOUND.volume *= 0.5;
    NEW_SHAPE_SOUND.loop = false;

    GAME_OVER_SOUND = new Audio("assets/gameover.wav");
    GAME_OVER_SOUND.loop = false;
}

function endGameFunction() {
    BACK_TRACK.pause();
    GAME_OVER_SOUND.play();
    CONTINUE_TIMER = false;
    alertPlayerToRestart();
}

function showStatusDiv() {
    document.getElementById("statusDiv").style.display = "flex";
}

function updateStatus() {
    let piecesH1 = document.getElementById("pieces");
    piecesH1.innerHTML = TOTAL_PIECES;

    let pointH1 = document.getElementById("points");
    pointH1.innerHTML = TOTAL_POINTS;
}

function tikTimer() {
    
    MS += 100;

    if (MS === 1000) {
        MS = 0;
        SS += 1;
    }
    if (SS === 60) {
        SS = 0;
        MM += 1;
    }

    if (MM < 10) {
        time = `0${MM}`;
    } else {
        time = MM;
    }

    if (SS < 10) {
        time += `:0${SS}:`;
    } else {
        time += `:${SS}:`;
    }

    time += `${MS/100}0`;

    if (CONTINUE_TIMER) {
        document.getElementById("timer").innerText = time; 
        setTimeout(function(){ tikTimer() }, 100);
    }
}

function alertPlayerToRestart() {
    document.getElementById("divToBeDeleted").style.display = "flex";

    let H2 = document.getElementById("startAndEndH2");
    H2.innerHTML = "Congratulations!!!";

    let H4 = document.getElementById("startAndEndH4");
    H4.innerHTML = "Stare at your final score as long as you like!!!";

    let H5 = document.getElementById("startAndEndH5");
    H5.innerHTML = "Refresh the page to play again.";
}

function getRandomInt(range) {
    return Math.floor(Math.random()*range);
}

function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}
