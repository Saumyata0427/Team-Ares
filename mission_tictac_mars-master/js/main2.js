// board setting
let BLANK = new Image()

let NOT_OCCUPIED = ' ';
let HEARTS = 'O';
let DABS = 'X';

let board = new Array()
let choice;
let h;
let d;
let active_turn = "HEARTS";


let messages = ["Oops! None of you reached Mars, Try again!",
    "Congratulations! Astronaut Hearts wins the race to Mars!",
    "Congratulations! Astronaut Dabs wins the race to Mars!"];

let heartsImgPath = './images/astro5.jpg';
let dabsImgPath = './images/astro4.jpg';

let heartsImg = new Image()
let dabsImg = new Image()

let blank_src = './images/blank2.png'
let blank_on_hover_src = './images/blank.png'

heartsImg.src = heartsImgPath;
dabsImg.src = dabsImgPath;

let params = (new URL(document.location)).searchParams;
let name = params.get('name');
let size = params.get('size');
let BOARD_SIZE = size*size;

var moveSound = new Audio('./music/soundeffects.wav')
var tieSound = new Audio('./music/drawresult.wav')
var winSound = new Audio('./music/win.wav')

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
    if (name === "dabs") {
        active_turn = "DABS"; TURN=1; h=0; d=0;
        turnInfo.innerHTML = "Astronaut Dabs as first player";
    } else if (name === "hearts") {
        active_turn = "HEARTS"; TURN=0; h=0; d=0;
        turnInfo.innerHTML = 'Astronaut Hearts as first player';
    }
}

function activeturninfo(turn,pieceMove){
    if(turn === 0){
        board[pieceMove] = HEARTS;
        document.images[pieceMove].src = heartsImgPath;
        document.images[pieceMove].setAttribute("onmouseover", heartsImgPath)
        document.images[pieceMove].setAttribute("onmouseout", heartsImgPath)
        document.images[pieceMove].style.cursor="default";
        moveSound.play();
        turn = 1; active_turn = "DABS"; 
        turnDisplay(active_turn);
        return turn;
    }
    else if(turn === 1){
        board[pieceMove] = DABS;
        document.images[pieceMove].src = dabsImgPath;
        document.images[pieceMove].setAttribute("onmouseover", dabsImgPath)
        document.images[pieceMove].setAttribute("onmouseout", dabsImgPath)
        document.images[pieceMove].style.cursor="default";
        moveSound.play();
        turn = 0; active_turn = "HEARTS";
        turnDisplay(active_turn);
        return turn;
    }
}

function turnDisplay(name){
    if (!isGameOver(board)) {
        var alert = document.getElementById("turnInfo");
        var a=Math.floor(Math.random() * Math.floor(3));
        if(a==1)
            alert.innerHTML = "Astronaut "+name+"! Go Into the Space!";
        else if(a==2)
            alert.innerHTML = "Astronaut "+name+"! Head towards the red planet, Mars!";
        else if(a==3)
            alert.innerHTML = "Astronaut "+name+"! Come out of the Earths Atmosphere!";
        else
            alert.innerHTML = "Astronaut "+name+"! Think of the best strategy";            
    }
}

function makeMove(pieceMove) {
    if (!isGameOver(board) && board[pieceMove] === NOT_OCCUPIED)
            TURN = activeturninfo(TURN,pieceMove);
}

function countHelp(turn,count,name,helps){
    var finish = document.getElementById("turnInfo");
    while(count<helps){
        minimax(board, 0, -Infinity, +Infinity);
        var move = choice;
        TURN = activeturninfo(turn,move);
        count++;
        return count;
    }        
    finish.innerHTML = "We can't help you!, Astronaut "+name;
}

function makeHelp(){
    if(TURN === 0)
        h = countHelp(0,h,active_turn,size-2);
    else if(TURN === 1)
        d = countHelp(1,d,active_turn,size-2);
}
  
function gameScore(currentBoard, depth) {
    var score = checkWinningCondition(currentBoard);
    if (score === 1) {
        return 0;
    } else if (score === 2) {
        return  10-depth;
    } else if (score === 3) {
        return  depth-10;
    }else {
        return 0;
    }
}

function minimax(node, depth, alpha, beta) {
    var x=checkWinningCondition(node);
    if (x === 1 || x === 2 || x === 3 || depth === 6){
        return gameScore(node, depth);
    }
    // the deeper the recursion, the higher the depths
    depth += 1;

    var availableMoves = getAvailableMoves(node);
    var move, result, possibleGameResult;
    if (active_turn === "HEARTS") {
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
    } else if(active_turn="DABS") {
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
    if (active_turn === "DABS") {
        piece = 'X';
        active_turn = "HEARTS";
    } else {
        piece = 'O';
        active_turn = 'DABS';
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
//   2 if HEARTS wins//HEARTS
//   3 if DABS wins//DABS
function checkWinningCondition(currentBoard) {
// checking for horizontal conditions
    if(BOARD_SIZE === 9){
        for(var i = 0; i <=6; i += 3){
        if (currentBoard[i] === HEARTS && currentBoard[i + 1] === HEARTS && currentBoard[i + 2] === HEARTS)
            return 2;
        if (currentBoard[i] === DABS && currentBoard[i + 1] === DABS && currentBoard[i + 2] === DABS)
            return 3;
        }

    // Check for vertical wins
    for (i = 0; i <= 2; i++) {
        if (currentBoard[i] === HEARTS && currentBoard[i + 3] === HEARTS && currentBoard[i + 6] === HEARTS)
            return 2;
        if (currentBoard[i] === DABS && currentBoard[i + 3] === DABS && currentBoard[i + 6] === DABS)
            return 3;
    }

    // Check for diagonal wins
    if ((currentBoard[0] === HEARTS && currentBoard[4] === HEARTS && currentBoard[8] === HEARTS) ||
        (currentBoard[2] === HEARTS && currentBoard[4] === HEARTS && currentBoard[6] === HEARTS))
        return 2;

    if ((currentBoard[0] === DABS && currentBoard[4] === DABS && currentBoard[8] === DABS) ||
        (currentBoard[2] === DABS && currentBoard[4] === DABS && currentBoard[6] === DABS))
        return 3;

    // Check for tie
    for (i = 0; i < BOARD_SIZE; i++) {
        if (currentBoard[i] !== HEARTS && currentBoard[i] !== DABS)
            return 0;
    }
    return 1;}
    else if(BOARD_SIZE===16){
        for (i = 0; i <= 12; i += 4) {
        if (currentBoard[i] === HEARTS && currentBoard[i + 1] === HEARTS && currentBoard[i + 2] === HEARTS && currentBoard[i + 3] === HEARTS)
            return 2;
        if (currentBoard[i] === DABS && currentBoard[i + 1] === DABS && currentBoard[i + 2] === DABS && currentBoard[i + 3] === DABS)
            return 3;
    }

    // Check for vertical wins
    for (i = 0; i <= 3; i++) {
        if (currentBoard[i] === HEARTS && currentBoard[i + 4] === HEARTS && currentBoard[i + 8] === HEARTS && currentBoard[i + 12] === HEARTS)
            return 2;
        if (currentBoard[i] === DABS && currentBoard[i + 4] === DABS && currentBoard[i + 8] === DABS && currentBoard[i + 12] === DABS)
            return 3;
    }

    // Check for diagonal wins
    if ((currentBoard[0] === HEARTS && currentBoard[5] === HEARTS && currentBoard[10] === HEARTS && currentBoard[15] === HEARTS) ||
        (currentBoard[3] === HEARTS && currentBoard[6] === HEARTS && currentBoard[9] === HEARTS && currentBoard[12] === HEARTS))
        return 2;

    if ((currentBoard[0] === DABS && currentBoard[5] === DABS && currentBoard[10] === DABS && currentBoard[15] === DABS) ||
        (currentBoard[3] === DABS && currentBoard[6] === DABS && currentBoard[9] === DABS && currentBoard[12] === DABS))
        return 3;

    // Check for tie
    for (i = 0; i < BOARD_SIZE; i++) {
        if (currentBoard[i] !== HEARTS && currentBoard[i] !== DABS)
            return 0;
    }
    return 1;
    }
    else{
        for (i = 0; i <= 20; i += 5) {
        if ((currentBoard[i] === HEARTS && currentBoard[i + 1] === HEARTS && currentBoard[i + 2] === HEARTS && currentBoard[i + 3] === HEARTS) ||
            (currentBoard[i + 1] === HEARTS && currentBoard[i + 2] === HEARTS && currentBoard[i + 3] === HEARTS && currentBoard[i + 4] === HEARTS))
            return 2;
        if ((currentBoard[i] === DABS && currentBoard[i + 1] === DABS && currentBoard[i + 2] === DABS && currentBoard[i + 3] === DABS ) || 
            (currentBoard[i + 1] === DABS && currentBoard[i + 2] === DABS && currentBoard[i + 3] === DABS && currentBoard[i + 4] === DABS))
            return 3;
    }

    // Check for vertical wins
    for (i = 0; i <= 4; i++) {
        if ((currentBoard[i] === HEARTS && currentBoard[i + 5] === HEARTS && currentBoard[i + 10] === HEARTS && currentBoard[i + 15] === HEARTS)|| 
            (currentBoard[i + 5] === HEARTS && currentBoard[i + 10] === HEARTS && currentBoard[i + 15] === HEARTS && currentBoard[i + 20] === HEARTS))
            return 2;
        if ((currentBoard[i] === DABS && currentBoard[i + 5] === DABS && currentBoard[i + 10] === DABS && currentBoard[i + 15] === DABS) ||
            (currentBoard[i + 5] === DABS && currentBoard[i + 10] === DABS && currentBoard[i + 15] === DABS&& currentBoard[i + 20] === DABS))
            return 3;
    }

    // Check for diagonal wins
    if ((currentBoard[0] === HEARTS && currentBoard[6] === HEARTS && currentBoard[12] === HEARTS && currentBoard[18] === HEARTS) ||
         (currentBoard[6] === HEARTS && currentBoard[12] === HEARTS && currentBoard[18] === HEARTS && currentBoard[24] === HEARTS) ||
          (currentBoard[1] === HEARTS && currentBoard[7] === HEARTS && currentBoard[13] === HEARTS && currentBoard[19] === HEARTS) ||
           (currentBoard[5] === HEARTS && currentBoard[11] === HEARTS && currentBoard[17] === HEARTS && currentBoard[23] === HEARTS) ||
        (currentBoard[4] === HEARTS && currentBoard[8] === HEARTS && currentBoard[12] === HEARTS && currentBoard[16] === HEARTS) ||
         (currentBoard[8] === HEARTS && currentBoard[12] === HEARTS && currentBoard[16] === HEARTS && currentBoard[20] === HEARTS) ||
         (currentBoard[3] === HEARTS && currentBoard[7] === HEARTS && currentBoard[11] === HEARTS && currentBoard[15] === HEARTS) ||
         (currentBoard[9] === HEARTS && currentBoard[13] === HEARTS && currentBoard[17] === HEARTS && currentBoard[21] === HEARTS))
        return 2;

    if ((currentBoard[0] === DABS && currentBoard[6] === DABS && currentBoard[12] === DABS && currentBoard[18] === DABS) ||
        (currentBoard[6] === DABS && currentBoard[12] === DABS && currentBoard[18] === DABS && currentBoard[24] === DABS) ||
        (currentBoard[1] === DABS && currentBoard[7] === DABS && currentBoard[13] === DABS && currentBoard[19] === DABS) ||
        (currentBoard[5] === DABS && currentBoard[11] === DABS && currentBoard[17] === DABS && currentBoard[23] === DABS) ||
        (currentBoard[4] === DABS && currentBoard[8] === DABS && currentBoard[12] === DABS && currentBoard[16] === DABS) ||
        (currentBoard[8] === DABS && currentBoard[12] === DABS && currentBoard[16] === DABS && currentBoard[20] === DABS) ||
        (currentBoard[3] === DABS && currentBoard[7] === DABS && currentBoard[11] === DABS && currentBoard[15] === DABS) ||
        (currentBoard[9] === DABS && currentBoard[13] === DABS && currentBoard[17] === DABS && currentBoard[21] === DABS))
        return 3;

    // Check for tie
    for (i = 0; i < BOARD_SIZE; i++) {
        if (currentBoard[i] !== HEARTS && currentBoard[i] !== DABS)
            return 0;
    }
    return 1;
    }
}


// Check for a winner.  Return
//   0 if no winner or tie yet
//   1 if it's a tie
//   2 if HEARTS wins//hearts
//   3 if DABS wins//dabs
function isGameOver(board) {
    var y= checkWinningCondition(board);
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
        winSound.play();
        turnInfo.innerHTML = messages[2];
    }
    return true;
}