// board setting
let BLANK = new Image();
let NOT_OCCUPIED = ' ';
let HUMAN = 'O';
let COMPUTER = 'X';

let board = new Array();
let choice;
let active_turn = "HUMAN"; // stores the symbol('O'or 'X') whose turn is active
let messages = ["None of you reached Mars, Try Again!",// winning messagess
    "Congratulations! You successfully landed on Mars!",
    "Oops! Your Spaceship crashed!"]

let humanImgPath = './images/astro1.jpg';//human player image
let computerImgPath = './images/astro2.jpg';//computer player image

let humanImg = new Image();
let computerImg = new Image();

//images of cells of the matrix while hovering it
let blank_src = './images/blank2.png';
let blank_on_hover_src = './images/blank.png';

humanImg.src = humanImgPath;
computerImg.src = computerImgPath;

// declaring variables fetching information from the address of corresponding HTML page
let params = (new URL(document.location)).searchParams;
let name = params.get('name');
let level = params.get('level');
let size = params.get('size');//order of matrix
let BOARD_SIZE = size*size;//number of cells in the matrix

//adding soundeffects
var moveSound = new Audio('./music/soundeffects.wav');
var loseSound = new Audio('./music/lose.wav');
var tieSound = new Audio('./music/drawresult.wav');
var winSound = new Audio('./music/win.wav');

//Whenever 'Replay' button is pressed on the corresponding HTML page, this function newboard() is called in the script to reset the board
function newboard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = NOT_OCCUPIED;
        document.images[i].src = blank_src;//image of the cell

        tile = document.images[i];
        tile.onmouseover = function(){
            this.src = blank_on_hover_src;//change in the image of cell while hovering it
            this.style.cursor="pointer";//change in the cursor while hovering the cell
        };
        tile.onmouseout = function(){
            this.src = blank_src;
            this.style.cursor="default";
        };
    }
    //disabling the corresponding size button after the size is choosen
    if (BOARD_SIZE == 9) {
        document.getElementById("size3").disabled = true;
    }
    else if (BOARD_SIZE == 16) {
        document.getElementById("size4").disabled = true;
    }
    else if (BOARD_SIZE == 25) {
        document.getElementById("size5").disabled = true;
    }
    //displaying name of the player who has chosen first turn to play 
    var turnInfo = document.getElementById("turnInfo");
    if (name === "computer") {
        active_turn = "COMPUTER";
        turnInfo.innerHTML = "Space Bot as first player";
        setTimeout(arbitraryMove,500);//calling the function arbitrayMove() when computer is first player 
    }
    else if (name === "human") {
        active_turn = "HUMAN";
        turnInfo.innerHTML = 'You as first player';
    }
}

//makes arbitrary move only when computer is the first player of the game
function arbitraryMove(){//defined centers and cornors of the matrix for the computer player to choose random move out of them 
    if(size == 3)
        var center_and_corners = [0, 2, 4, 6, 8];
    else if(size == 4)
        var center_and_corners = [0, 3, 5, 6, 9, 10, 12, 15];     
    else if(size == 5)
        var center_and_corners = [0, 2, 4, 10, 12, 14, 20, 22, 24];

    var first_choice = center_and_corners[Math.floor(Math.random() * center_and_corners.length)];//randomising the first move of computer
    computerOnBoard(first_choice);//calling the function to make changes on the board
}

//changes made on the board when computer plays its move
function computerOnBoard(move){
    board[move] = COMPUTER;// board is updated with the move
    document.images[move].src = computerImgPath; //cell image is changed to the computer player image
    document.images[move].setAttribute("onmouseover", computerImgPath);
    document.images[move].setAttribute("onmouseout", computerImgPath);
    document.images[move].style.cursor="default";//cursor pointer is set to default while hovering on cell
    moveSound.play();//playing the move sound

    active_turn = "HUMAN";//now the active turn is of human
    if (!isGameOver(board)){//if the game is not over , displaying message for the human to play his/her move
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

//Whenever active turn is of human, this function validTurn() is called to check the validity of the human move
function validTurn() {
    var y= checkWinningCondition(board);//to check whether the game is tie, won , or lostss
    if(y == 0)
        return 1;
    else 
        return 0;
}

//Whenever the cell of the matrix is clicked upon by the human the function makeMove() is called in the script
function makeMove(pieceMove) {

    if(!validTurn()) {//checking the validity of human move
        return;
    }

    if (!isGameOver(board) && board[pieceMove] === NOT_OCCUPIED) {
        board[pieceMove] = HUMAN;//board is updated
        document.images[pieceMove].src = humanImgPath;//cell image is changed to the human player image
        document.images[pieceMove].setAttribute("onmouseover", humanImgPath);
        document.images[pieceMove].setAttribute("onmouseout", humanImgPath);
        document.images[pieceMove].style.cursor="default";//cursor pointer is set to default while hovering on the cell
        moveSound.play();//playing the move sound

        if (!isGameOver(board)) {
            var alert = document.getElementById("turnInfo");
            active_turn = "COMPUTER"; //now active turn is of computer
            alert.innerHTML = "Computer's turn";//displaying the message for computer's turn
            setTimeout(AImove, 500);//calling the function AImove for computer to play its turn
        }
    }
}

//calling the function AImove for computer to play its turn 
function AImove() {
    minimax(board, 0, -Infinity, +Infinity);//calling the function minimax() to execute minimax algorithm along with alpha beta pruning 
    var move = choice;//returned move is stored
    computerOnBoard(move);//function called to make changes on the board
}

//calling the function minimax() to execute minimax algorithm along with alpha beta pruning passing the parameters board,depth,alpha and beta
function minimax(node, depth, alpha, beta) {
    var x=checkWinningCondition(node);//this function is called to check whether the game has tied, or won or lost by the human
    if (x === 1 || x === 2 || x === 3 || depth === 6 || 
       (level == 'very_easy' && depth == 1) || (level == 'easy' && depth == 2) ||
       (level == 'medium' && depth == 3)){//either the game has won ,lost or tied, or maximum depth has been reached
        return gameScore(node, depth);//calling this function to return the score of the board 
    }

    // the deeper the recursion, the higher the depths
    depth += 1;

    var availableMoves = getAvailableMoves(node);//calling this function to get available moves for computer to play
    var move, result, possibleGameResult;
    if (active_turn === "COMPUTER") {
        for (var i = 0; i < availableMoves.length; i++) {
            move = availableMoves[i];
            possibleGameResult = getNewState(move, node);//updated board when computer plays 
            result = minimax(possibleGameResult, depth, alpha, beta);//calling minimax with the updated board and depth
            node = undoMove(node, move);//calling this function to undo the move made by computer
            if (result > alpha) {
                alpha = result;
                if (depth === 1) {
                    choice = move;
                }
            } else if (alpha >= beta) {
                return alpha;
            }
        }
        return alpha;
    } else {//when active turn is of human
        for (var i = 0; i < availableMoves.length; i++) {
            move = availableMoves[i];
            possibleGameResult = getNewState(move, node);//updated board when human plays
            result = minimax(possibleGameResult, depth, alpha, beta);//calling minimax with the updated board and depth
            node = undoMove(node, move);//calling this function to undo the move made by human
            if (result < beta) {
                beta = result;
                if (depth === 1) {
                    choice = move;
                }
            } else if (beta <= alpha) {
                return beta;
            }
        }
        return beta;
    }
}

//to get moves available to play
function getAvailableMoves(currentBoard) {
    var possibleMoves = new Array();
    for (var i = 0; i < BOARD_SIZE; i++) {
        if (currentBoard[i] === NOT_OCCUPIED) {
            possibleMoves.push(i);//storing the empty cells in an array
        }
    }
    return possibleMoves;
}

//calling the function gameScore to return the score of the board
function gameScore(currentBoard, depth) {
    var score = checkWinningCondition(currentBoard);
    //scores are decided on the basis of depth
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

//to update the board with the move 
function getNewState(move, currentBoard) {
    var piece = changeTurn();//calling this function changeTurn() to change the active turn
    currentBoard[move] = piece;
    return currentBoard;
}

//to change the turn
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

//to undo the move played
function undoMove(currentBoard, move) {
    currentBoard[move] = NOT_OCCUPIED;//cell gets empty
    changeTurn();
    return currentBoard;
}

// Check for a winner.  Return
//   0 if no winner or tie yet
//   1 if it's a tie
//   2 if HUMAN wins
//   3 if COMPUTER wins
function checkWinningCondition(currentBoard) {
    if(BOARD_SIZE === 9){
        for(var i = 0; i <= 6; i += 3){//check for horizontal lines
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
        for (i = 0; i <= 12; i += 4) {//check for horizontal lines
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
        for (i = 0; i <= 20; i += 5) {//check for horizontal lines
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

//to check whether the game is over or not , and if it is over display the result  
function isGameOver(board) {
    var y=checkWinningCondition(board);
    if (y === 0) {
        return false;//game is not over
    } else if (y === 1) {
        var turnInfo = document.getElementById("turnInfo");
        tieSound.play();
        turnInfo.innerHTML = messages[0];//It is a tie
    } else if (y === 2) {
        var turnInfo = document.getElementById("turnInfo");
        winSound.play();
        turnInfo.innerHTML = messages[1];//human wins
    } else {
        var turnInfo = document.getElementById("turnInfo");
        loseSound.play();
        turnInfo.innerHTML = messages[2];//computer wins
    }
    return true;
}
