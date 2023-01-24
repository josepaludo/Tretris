
let GLOBAL_MATRIX = [];


// Game start

function startGameFunction() {
    createTetrisGrid();
    deleteStartButton();

    placePieceOnMatrix(letterT);
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

// arbitraty row and col, doesn't check for anything, creates object
function placePieceOnMatrix(pieceObject) {
    let piece = Object.create(pieceObject);
    let row = 3;
    let col = 5;
    let coord;
    let coordRow;
    let coordCol;

    for (let squareInd = 0; squareInd < piece.coords.length; squareInd++) {
        coordRow = piece.coords[squareInd][0] + row;
        coordCol = piece.coords[squareInd][1] + col;
        GLOBAL_MATRIX[coordRow][coordCol].style.backgroundColor = piece.color;
    }
}

let letterI = {
    code: undefined,
    color: "maroon",
    coords: [[0, 0], [1, 0], [2, 0], [3, 0]]
}

let letterO = {
    code: undefined,
    color: "silver",
    coords: [[0, 0], [0, 1], [1, 0], [1, 1]]
}

let letterL = {
    code: undefined,
    color: "lime",
    coords: [[0, 0], [1, 0], [2, 0], [2, 1]]
}

let letterJ = {
    code: undefined,
    color: "teal",
    coords: [[0, 0], [1, 0], [2, 0], [2, -1]]
}

let letterS = {
    code: undefined,
    color: "aqua",
    coords: [[0, 0], [0, 1], [-1, 1], [-1, 2]]
}

let letterZ = {
    code: undefined,
    color: "navy",
    coords: [[0, 0], [0, 1], [1, 1], [1, 2]]
}

let letterT = {
    code: undefined,
    color: "purple",
    coords: [[0, 0], [0, 1], [0, 2], [1, 1]]
}
