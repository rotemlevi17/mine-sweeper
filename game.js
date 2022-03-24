'use strict'

var CELL_MINE = "&#10036;";
var CELL_NONE = "&#11036;";
var CELL_FLAG = "&#127987;";
var STATUS_SUCCESS = "&#128513;";
var STATUS_FAILED = "&#128557;";
var gBoard;
var timerRef = null;
var timerDisplay = document.querySelector(".time");
/**
 * cell:
 *{minesAroundCount: 4, isShown: true, isMine: false, isMarked: true}
 */

var gLevel = { SIZE: 4, MINES: 4 };
var gGame = {

    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() {
    var board = buildBoard();
    renderBoard(board);
    var statusGame = document.querySelector('.status-game');
    statusGame.innerHTML = STATUS_SUCCESS;
    gGame.isOn = true;
    timerDisplay.textContent = '000';
    gGame.secsPassed = 0;
}

function buildBoard() {
    gBoard = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        var row = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            row.push({ minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }) // insert new cell
        }
        gBoard.push(row)
    }
    setMinesInBord();
    setMinesNegsCount();
    /**/
    return gBoard;
}

function setMinesNegsCount() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                if (j !== 0) gBoard[i][j - 1].minesAroundCount = gBoard[i][j - 1].minesAroundCount + 1;
                if (j < gLevel.SIZE - 1) gBoard[i][j + 1].minesAroundCount = gBoard[i][j + 1].minesAroundCount + 1;
                if (i !== 0) gBoard[i - 1][j].minesAroundCount = gBoard[i - 1][j].minesAroundCount + 1;
                if (i < gLevel.SIZE - 1) gBoard[i + 1][j].minesAroundCount = gBoard[i + 1][j].minesAroundCount + 1;
                if (j !== 0 && i !== 0) gBoard[i - 1][j - 1].minesAroundCount = gBoard[i][j].minesAroundCount + 1;
                if (i !== 0 && j < gLevel.SIZE - 1) gBoard[i - 1][j + 1].minesAroundCount = gBoard[i - 1][j + 1].minesAroundCount + 1;
                if (j !== 0 && i < gLevel.SIZE - 1) gBoard[i + 1][j - 1].minesAroundCount = gBoard[i + 1][j - 1].minesAroundCount + 1;
                if (j < gLevel.SIZE - 1 && i < gLevel.SIZE - 1) gBoard[i + 1][j + 1].minesAroundCount = gBoard[i + 1][j + 1].minesAroundCount + 1;
            }
        }
    }
}

function renderBoard(board) {
    var strHTML = ""
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += "<tr>";
        for (var j = 0; j < gLevel.SIZE; j++) {
            strHTML += `<td id="cell_${i}_${j}" oncontextmenu='myFlag(${i},${j})' onclick="myFunc(this, ${i},${j});">${CELL_NONE}</td>`
        }
        strHTML += "</tr>";
    }
    var tableBody = document.querySelector(".table-body");
    tableBody.innerHTML = strHTML;
}

function myFlag(i, j) {
    document.getElementById(`cell_${i}_${j}`).innerHTML = CELL_FLAG
}

function myFunc(td, i, j) {
    //
    if (gGame.isOn === false) {
        return;
    }
    if (timerRef === null) {
        timerRef = setInterval(function() {
            gGame.secsPassed++;
            timerDisplay.textContent = (gGame.secsPassed / 60).toFixed(2);
        }, 1)
    }
    console.log(i, j);
    if (gBoard[i][j].isMine === true) {
        td.innerHTML = CELL_MINE;
        document.querySelector(".status-game").innerHTML = STATUS_FAILED
            // sad smiley
        gameOver();
    } else if (gBoard[i][j].minesAroundCount === 0) {
        td.innerHTML = " ";
        if (i > 0) { // שורה עליונה 
            myFunc(document.getElementById(`cell_${i-1}_${j}`), i - 1, j); // [ ] [X] [ ]
            if (j > 0) {
                myFunc(document.getElementById(`cell_${i-1}_${j-1}`), i - 1, j - 1); // [X] [ ] [ ]
            }
            if (j < gGame.SIZE) {
                myFunc(document.getElementById(`cell_${i-1}_${j+1}`), i - 1, j + 1); // [ ] [ ] [X]
            }
        }
        if (j > 0) { // שורה נוכחית
            myFunc(document.getElementById(`cell_${i}_${j-1}`), i, j - 1); // [X] [ ] [ ]
        }
        if (j < gGame.SIZE) {
            myFunc(document.getElementById(`cell_${i}_${j+1}`), i, j + 1); // [ ] [ ] [X]
        }
        if (i < gGame.SIZE) { // שורה תחתונה 
            myFunc(document.getElementById(`cell_${i+1}_${j}`), i + 1, j); // [ ] [X] [ ]
            if (j > 0) {
                myFunc(document.getElementById(`cell_${i+1}_${j-1}`), i + 1, j - 1); // [X] [ ] [ ]
            }
            if (j < gGame.SIZE) {
                myFunc(document.getElementById(`cell_${i+1}_${j+1}`), i + 1, j + 1); // [ ] [ ] [X]
            }
        }

    } else {
        if (gBoard[i][j].minesAroundCount === 1) {
            td.style.color = 'blue'
        }
        td.innerHTML = gBoard[i][j].minesAroundCount;
    }

}


function setGameLevel(size) {
    gLevel.SIZE = size;
    gLevel.MINES = size;
    initGame();
}

/*function clickCell(cell) {
    // console.log(input);
    // input.classList.remove("unclicked")
    // input.classList.add("clicked")

    if (cell.innerText === MINE) {
        //game over or lose life
        if (gLives > 1) {
            gLives--
            console.log(gLives);
        } else {
            gameOver()
        }
    }

}

*/
function getRandomforMine() {
    return Math.floor(Math.random() * (gLevel.SIZE - 1 + 1));
}

function setMinesInBord() {
    for (let index = 0; index < gLevel.MINES; index++) {
        gBoard[getRandomforMine()][getRandomforMine()].isMine = true;
    }
}




function gameOver() {
    console.log('Game over');
    clearInterval(timerRef)
    timerRef = null;
    gGame.secsPassed = 0;
    gGame.isOn = false;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine === true) {
                document.getElementById(`cell_${i}_${j}`).innerHTML = CELL_MINE;
            }
        }
    }
}