// board setting
let BLANK = new Image()
let NOT_OCCUPIED = ' ';
let HUMAN = 'O';
let COMPUTER = 'X';

let board = new Array()
let choice;
let active_turn = "HUMAN";
let messages = ["None of you reached Mars, Try Again!",
    "Congratulations! You successfully landed on Mars!",
    "Oops! Your Spaceship crashed!"]

let humanImgPath = './images/astro1.jpg';
let computerImgPath = './images/astro2.jpg';

let humanImg = new Image()
let computerImg = new Image()

let blank_src = './images/blank2.png'
let blank_on_hover_src = './images/blank.png'

humanImg.src = humanImgPath;
computerImg.src = computerImgPath;

let params = (new URL(document.location)).searchParams;
let name = params.get('name');
let level = params.get('level');
let size = params.get('size');
let BOARD_SIZE = size*size;

var moveSound = new Audio('./music/soundeffects.wav')
var loseSound = new Audio('./music/lose.wav')
var tieSound = new Audio('./music/drawresult.wav')
var winSound = new Audio('./music/win.wav')

function validTurn() {
    X_sum = name == "computer" ? 1 : 0;
    O_sum = 0
    for(var i = 0; i < BOARD_SIZE; i++) {
        if(board[i] == 'X') {
            X_sum++;
        } else if (board[i] == "O"){
            O_sum++;
        }
    }
    isValid =  (X_sum + O_sum) % 2 == 0;
    return isValid
}

function newboard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = NOT_OCCUPIED;
        document.images[i].src = blank_src;

        tile = document.images[i];
        tile.onmouseover = function(){
            this.src = blank_on_hover_src;
            this.style.cursor="pointer";
        };
        tile.onmouseout = function(){
            this.src = blank_src;
            this.style.cursor="default";
        };
    }

    if (BOARD_SIZE == 9) {
        document.getElementById("size3").disabled = true;;
    }
    else if (BOARD_SIZE == 16) {
        document.getElementById("size4").disabled = true;;
    }
    else if (BOARD_SIZE == 25) {
        document.getElementById("size5").disabled = true;;
    }

    var turnInfo = document.getElementById("turnInfo");
    if (name === "computer") {
        active_turn = "COMPUTER";
        turnInfo.innerHTML = "Space Bot as first player";
        setTimeout(arbitraryMove,500);
    }
    else if (name === "human") {
        active_turn = "HUMAN";
        turnInfo.innerHTML = 'You as first player';
    }
}
function computerOnBoard(move){
    board[move] = COMPUTER;
    document.images[move].src = computerImgPath;
    document.images[move].setAttribute("onmouseover", computerImgPath)
    document.images[move].setAttribute("onmouseout", computerImgPath)
    document.images[move].style.cursor="default";
    choice = [];
    active_turn = "HUMAN";
    if (!isGameOver(board)){
        var alert = document.getElementById("turnInfo");
        var a=Math.floor(Math.random() * Math.floor(3));
        if(a == 1)
           alert.innerHTML = "Go into the Space!";
        else if(a == 2)
            alert.innerHTML= " Head towards the red planet, Mars!";
        else if(a == 3)
            alert.innerHTML= " Come out of the Earths Atmosphere!";
        else
            alert.innerHTML= "Think of the best strategy";
        }
}
//makes arbitrary move when comp plays first for 3x3
function arbitraryMove(){
    if(size == 3)
        {var center_and_corners = [0, 2, 4, 6, 8];}
    else if(size == 4)
        {var center_and_corners = [0, 3, 5, 6, 9, 10, 12, 15];}     
    else if(size == 5)
        {var center_and_corners = [0, 2, 4, 10, 12, 14, 20, 22, 24];}

    var first_choice = center_and_corners[Math.floor(Math.random() * center_and_corners.length)];
    computerOnBoard(first_choice);
}

function AImove() {
    minimax(board, 0, -Infinity, +Infinity);
    var move = choice;
    computerOnBoard(move);
}

function makeMove(pieceMove) {

    if(!validTurn()) {
        return 
    }

    if (!isGameOver(board) && board[pieceMove] === NOT_OCCUPIED) {
        board[pieceMove] = HUMAN;
        document.images[pieceMove].src = humanImgPath;
        document.images[pieceMove].setAttribute("onmouseover", humanImgPath)
        document.images[pieceMove].setAttribute("onmouseout", humanImgPath)
        document.images[pieceMove].style.cursor="default";
        moveSound.play();

        if (!isGameOver(board)) {
            var alert = document.getElementById("turnInfo");
            active_turn = "COMPUTER";
            alert.innerHTML = "Computer's turn"
            setTimeout(AImove, 500);
        }
    }
}

function gameScore(currentBoard, depth) {
    var score = checkWinningCondition(currentBoard);
    if (score === 1) {
        return 0;
    } else if (score === 2) {
        return depth - 10;
    } else if (score === 3) {
        return 10 - depth;
    }else {
        return 0;
    }
}

function minimax(node, depth, alpha, beta) {
    var x=checkWinningCondition(node);
    if (x === 1 || x === 2 || x === 3 || depth === 6 || 
       (level == 'very_easy' && depth == 1) || (level == 'easy' && depth == 2) ||
       (level == 'medium' && depth == 3)){
        return gameScore(node, depth);
    }

    // the deeper the recursion, the higher the depths
    depth += 1;

    var availableMoves = getAvailableMoves(node);
    var move, result, possibleGameResult;
    if (active_turn === "COMPUTER") {
        for (var i = 0; i < availableMoves.length; i++) {
            move = availableMoves[i];
            possibleGameResult = getNewState(move, node);
            result = minimax(possibleGameResult, depth, alpha, beta);
            node = undoMove(node, move);
            if (result > alpha) {
                alpha = result
                if (depth === 1) {
                    choice = move
                }
            } else if (alpha >= beta) {
                return alpha;
            }
        }
        return alpha;
    } else {
        for (var i = 0; i < availableMoves.length; i++) {
            move = availableMoves[i];
            possibleGameResult = getNewState(move, node);
            result = minimax(possibleGameResult, depth, alpha, beta);
            node = undoMove(node, move);
            if (result < beta) {
                beta = result
                if (depth === 1) {
                    choice = move
                }
            } else if (beta <= alpha) {
                return beta;
            }
        }
        return beta;
    }
}

function undoMove(currentBoard, move) {
    currentBoard[move] = NOT_OCCUPIED;
    changeTurn();
    return currentBoard;
}

function getNewState(move, currentBoard) {
    var piece = changeTurn();
    currentBoard[move] = piece;
    return currentBoard;
}

function changeTurn() {
    var piece;
    if (active_turn === "COMPUTER") {
        piece = 'X';
        active_turn = "HUMAN";
    } else {
        piece = 'O';
        active_turn = 'COMPUTER';
    }
    return piece;
}

function getAvailableMoves(currentBoard) {
    var possibleMoves = new Array();
    for (var i = 0; i < BOARD_SIZE; i++) {
        if (currentBoard[i] === NOT_OCCUPIED) {
            possibleMoves.push(i);
        }
    }
    return possibleMoves;
}

// Check for a winner.  Return
//   0 if no winner or tie yet
//   1 if it's a tie
//   2 if HUMAN wins
//   3 if COMPUTER wins
function checkWinningCondition(currentBoard) {
    if(BOARD_SIZE === 9){
        for(var i = 0; i <= 6; i += 3){
        if (currentBoard[i] === HUMAN && currentBoard[i + 1] === HUMAN && currentBoard[i + 2] === HUMAN)
            return 2;
        if (currentBoard[i] === COMPUTER && currentBoard[i + 1] === COMPUTER && currentBoard[i + 2] === COMPUTER)
            return 3;
        }

    // Check for vertical wins
        for (i = 0; i <= 2; i++) {
            if (currentBoard[i] === HUMAN && currentBoard[i + 3] === HUMAN && currentBoard[i + 6] === HUMAN)
            return 2;
            if (currentBoard[i] === COMPUTER && currentBoard[i + 3] === COMPUTER && currentBoard[i + 6] === COMPUTER)
            return 3;
        }

    // Check for diagonal wins
        if ((currentBoard[0] === HUMAN && currentBoard[4] === HUMAN && currentBoard[8] === HUMAN) ||
            (currentBoard[2] === HUMAN && currentBoard[4] === HUMAN && currentBoard[6] === HUMAN))
            return 2;

        if ((currentBoard[0] === COMPUTER && currentBoard[4] === COMPUTER && currentBoard[8] === COMPUTER) ||
            (currentBoard[2] === COMPUTER && currentBoard[4] === COMPUTER && currentBoard[6] === COMPUTER))
            return 3;

    // Check for tie
        for (i = 0; i < BOARD_SIZE; i++) {
            if (currentBoard[i] !== HUMAN && currentBoard[i] !== COMPUTER)
                return 0;
        }
        return 1;
    }
    else if(BOARD_SIZE===16){
        for (i = 0; i <= 12; i += 4) {
            if (currentBoard[i] === HUMAN && currentBoard[i + 1] === HUMAN && currentBoard[i + 2] === HUMAN && currentBoard[i + 3] === HUMAN)
                return 2;
            if (currentBoard[i] === COMPUTER && currentBoard[i + 1] === COMPUTER && currentBoard[i + 2] === COMPUTER && currentBoard[i + 3] === COMPUTER)
                return 3;
        }

    // Check for vertical wins
        for (i = 0; i <= 3; i++) {
            if (currentBoard[i] === HUMAN && currentBoard[i + 4] === HUMAN && currentBoard[i + 8] === HUMAN && currentBoard[i + 12] === HUMAN)
                return 2;
            if (currentBoard[i] === COMPUTER && currentBoard[i + 4] === COMPUTER && currentBoard[i + 8] === COMPUTER && currentBoard[i + 12] === COMPUTER)
                return 3;
        }

    // Check for diagonal wins
        if ((currentBoard[0] === HUMAN && currentBoard[5] === HUMAN && currentBoard[10] === HUMAN && currentBoard[15] === HUMAN) ||
            (currentBoard[3] === HUMAN && currentBoard[6] === HUMAN && currentBoard[9] === HUMAN && currentBoard[12] === HUMAN))
            return 2;

        if ((currentBoard[0] === COMPUTER && currentBoard[5] === COMPUTER && currentBoard[10] === COMPUTER && currentBoard[15] === COMPUTER) ||
            (currentBoard[3] === COMPUTER && currentBoard[6] === COMPUTER && currentBoard[9] === COMPUTER && currentBoard[12] === COMPUTER))
            return 3;

    // Check for tie
        for (i = 0; i < BOARD_SIZE; i++) {
            if (currentBoard[i] !== HUMAN && currentBoard[i] !== COMPUTER)
                return 0;
        }
        return 1;
    }
    else{
        for (i = 0; i <= 20; i += 5) {
            if ((currentBoard[i] === HUMAN && currentBoard[i + 1] === HUMAN && currentBoard[i + 2] === HUMAN && currentBoard[i + 3] === HUMAN) ||
                (currentBoard[i + 1] === HUMAN && currentBoard[i + 2] === HUMAN && currentBoard[i + 3] === HUMAN && currentBoard[i + 4] === HUMAN))
                return 2;
            if ((currentBoard[i] === COMPUTER && currentBoard[i + 1] === COMPUTER && currentBoard[i + 2] === COMPUTER && currentBoard[i + 3] === COMPUTER ) || 
                (currentBoard[i + 1] === COMPUTER && currentBoard[i + 2] === COMPUTER && currentBoard[i + 3] === COMPUTER && currentBoard[i + 4] === COMPUTER))
                return 3;
        }

    // Check for vertical wins
        for (i = 0; i <= 4; i++) {
            if ((currentBoard[i] === HUMAN && currentBoard[i + 5] === HUMAN && currentBoard[i + 10] === HUMAN && currentBoard[i + 15] === HUMAN)|| 
                (currentBoard[i + 5] === HUMAN && currentBoard[i + 10] === HUMAN && currentBoard[i + 15] === HUMAN && currentBoard[i + 20] === HUMAN))
                return 2;
            if ((currentBoard[i] === COMPUTER && currentBoard[i + 5] === COMPUTER && currentBoard[i + 10] === COMPUTER && currentBoard[i + 15] === COMPUTER) ||
                (currentBoard[i + 5] === COMPUTER && currentBoard[i + 10] === COMPUTER && currentBoard[i + 15] === COMPUTER&& currentBoard[i + 20] === COMPUTER))
                return 3;
        }

    // Check for diagonal wins
        if ((currentBoard[0] === HUMAN && currentBoard[6] === HUMAN && currentBoard[12] === HUMAN && currentBoard[18] === HUMAN) ||
            (currentBoard[6] === HUMAN && currentBoard[12] === HUMAN && currentBoard[18] === HUMAN && currentBoard[24] === HUMAN) ||
            (currentBoard[1] === HUMAN && currentBoard[7] === HUMAN && currentBoard[13] === HUMAN && currentBoard[19] === HUMAN) ||
            (currentBoard[5] === HUMAN && currentBoard[11] === HUMAN && currentBoard[17] === HUMAN && currentBoard[23] === HUMAN) ||
            (currentBoard[4] === HUMAN && currentBoard[8] === HUMAN && currentBoard[12] === HUMAN && currentBoard[16] === HUMAN) ||
            (currentBoard[8] === HUMAN && currentBoard[12] === HUMAN && currentBoard[16] === HUMAN && currentBoard[20] === HUMAN) ||
            (currentBoard[3] === HUMAN && currentBoard[7] === HUMAN && currentBoard[11] === HUMAN && currentBoard[15] === HUMAN) ||
            (currentBoard[9] === HUMAN && currentBoard[13] === HUMAN && currentBoard[17] === HUMAN && currentBoard[21] === HUMAN))
            return 2;

        if ((currentBoard[0] === COMPUTER && currentBoard[6] === COMPUTER && currentBoard[12] === COMPUTER && currentBoard[18] === COMPUTER) ||
            (currentBoard[6] === COMPUTER && currentBoard[12] === COMPUTER && currentBoard[18] === COMPUTER && currentBoard[24] === COMPUTER) ||
            (currentBoard[1] === COMPUTER && currentBoard[7] === COMPUTER && currentBoard[13] === COMPUTER && currentBoard[19] === COMPUTER) ||
            (currentBoard[5] === COMPUTER && currentBoard[11] === COMPUTER && currentBoard[17] === COMPUTER && currentBoard[23] === COMPUTER) ||
            (currentBoard[4] === COMPUTER && currentBoard[8] === COMPUTER && currentBoard[12] === COMPUTER && currentBoard[16] === COMPUTER) ||
            (currentBoard[8] === COMPUTER && currentBoard[12] === COMPUTER && currentBoard[16] === COMPUTER && currentBoard[20] === COMPUTER) ||
            (currentBoard[3] === COMPUTER && currentBoard[7] === COMPUTER && currentBoard[11] === COMPUTER && currentBoard[15] === COMPUTER) ||
            (currentBoard[9] === COMPUTER && currentBoard[13] === COMPUTER && currentBoard[17] === COMPUTER && currentBoard[21] === COMPUTER))
            return 3;

    // Check for tie
        for (i = 0; i < BOARD_SIZE; i++) {
            if (currentBoard[i] !== HUMAN && currentBoard[i] !== COMPUTER)
                return 0;
        }
        return 1;
    }
}


// Check for a winner.  Return
//   0 if no winner or tie yet
//   1 if it's a tie
//   2 if HUMAN wins
//   3 if COMPUTER wins
function isGameOver(board) {
    var y=checkWinningCondition(board);
    if (y === 0) {
        return false
    } else if (y === 1) {
        var turnInfo = document.getElementById("turnInfo");
        tieSound.play()
        turnInfo.innerHTML = messages[0];
    } else if (y === 2) {
        var turnInfo = document.getElementById("turnInfo");
        winSound.play();
        turnInfo.innerHTML = messages[1];
    } else {
        var turnInfo = document.getElementById("turnInfo");
        loseSound.play();
        turnInfo.innerHTML = messages[2];
    }
    return true;
}