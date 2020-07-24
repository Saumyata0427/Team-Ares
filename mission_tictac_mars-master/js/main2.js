// board setting
let BLANK = new Image();
let NOT_OCCUPIED = ' ';
let HEARTS = 'O';
let DABS = 'X';

let board = new Array();
let choice;
let h,d,TURN;
let active_turn = "HEARTS";// stores the symbol('O'or 'X') whose turn is active

let messages = ["Oops! None of you reached Mars, Try again!",//winning messgaes
    "Congratulations! Astronaut Hearts wins the race to Mars!",
    "Congratulations! Astronaut Dabs wins the race to Mars!"];

let heartsImgPath = './images/astro5.jpg';
let dabsImgPath = './images/astro4.jpg';

let heartsImg = new Image();//Astronuat hearts image
let dabsImg = new Image();//Astronaut dabs image

//images of cells of the matrix while hovering it
let blank_src = './images/blank2.png';
let blank_on_hover_src = './images/blank.png';

heartsImg.src = heartsImgPath;
dabsImg.src = dabsImgPath;

// declaring variables fetching information from the address of corresponding HTML page
let params = (new URL(document.location)).searchParams;
let name = params.get('name');
let size = params.get('size');//order of matrix
let BOARD_SIZE = size*size;//number of cells in the matrix

//adding soundeffects
var moveSound = new Audio('./music/soundeffects.wav');
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
    if (name === "dabs") {
        active_turn = "DABS"; TURN=1; h=0; d=0;//For Astronaut Dabs TURN=1
        turnInfo.innerHTML = "Astronaut Dabs as first player";
    } else if (name === "hearts") {
        active_turn = "HEARTS"; TURN=0; h=0; d=0;//For Astronaut Hearts TURN=0
        turnInfo.innerHTML = 'Astronaut Hearts as first player';
    }
}
//Whenever a cell is pressed upon by the either player, this function validTurn() is called to check the validity of the move
function validTurn() {
    var y= checkWinningCondition(board);//to check whether the game is tie, or won 
    if(y == 0)
        return 1;
    else 
        return 0;
}
//Whenever the cell of the matrix is clicked upon by the either player the function makeMove() is called in the script
function makeMove(pieceMove) {
    if(!validTurn()) {//checking the validity of move
        return;
    }
    if (!isGameOver(board) && board[pieceMove] === NOT_OCCUPIED)
            TURN = activeturninfo(TURN,pieceMove);//this function is called for to make changes on the board 
}                                                 //corresponding to whose turn it is and to change the turn

function activeturninfo(turn,pieceMove){
    if(turn === 0){
        board[pieceMove] = HEARTS;//if active turn is of Astronaut Hearts
        document.images[pieceMove].src = heartsImgPath;//cell image is changed to Astronaut Hearts player image
        document.images[pieceMove].setAttribute("onmouseover", heartsImgPath);
        document.images[pieceMove].setAttribute("onmouseout", heartsImgPath);
        document.images[pieceMove].style.cursor="default";//cursor pointer is set to default while hovering on the cell
        moveSound.play();//playing the move sound
        turn = 1; active_turn = "DABS"; //changing the turn
        turnDisplay(active_turn);//to display whose turn next to play
        return turn;
    }
    else if(turn === 1){
        board[pieceMove] = DABS;//if active turn is of Astronaut Dabs
        document.images[pieceMove].src = dabsImgPath;//cell image is changed to Astronaut Dabs player image
        document.images[pieceMove].setAttribute("onmouseover", dabsImgPath);
        document.images[pieceMove].setAttribute("onmouseout", dabsImgPath);
        document.images[pieceMove].style.cursor="default";
        moveSound.play();
        turn = 0; active_turn = "HEARTS";//changing the turn
        turnDisplay(active_turn);
        return turn;
    }
}

//to display whose turn next to play
function turnDisplay(name){
    if (!isGameOver(board)) {//if game is not over
        var alert = document.getElementById("turnInfo");
        var a=Math.floor(Math.random() * Math.floor(3));
        //displaying message for the player whose turn it is , to play
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
//Whenever 'Lifeguard' button is pressed upon by the active turn player , computer plays on behalf of him/her
function makeHelp(){
    if(TURN === 0)
        h = countHelp(0,h,active_turn,size-2);//to count the number of helps provided by the computer for the corresponding size of the matrix 
    else if(TURN === 1)                       //1 help for size = 3, 2 helps for size = 4, 3 helps for size = 5 
        d = countHelp(1,d,active_turn,size-2);
}

function countHelp(turn,count,name,helps){
    var finish = document.getElementById("turnInfo");
    while(count<helps){//while loop will run till the help count reaches the maximum helps to be provided 
        minimax(board, 0, -Infinity, +Infinity);//to execute minimax algorithm along with alpha beta pruning passing the parameters board,depth,alpha and beta
        var move = choice;
        TURN = activeturninfo(turn,move);//to make changes on the board corresponding to the help provided by computer and to change the turn 
        count++;
        return count;
    }        
    finish.innerHTML = "We can't help you!, Astronaut "+name;//display message if all the helps are used 
}

function minimax(node, depth, alpha, beta) {
    var x=checkWinningCondition(node);//this function is called to check whether the game has tied, or won by the either player
    if (x === 1 || x === 2 || x === 3 || depth === 6){//either the game has won or tied, or maximum depth has been reached
        return gameScore(node, depth);//calling this function to return the score of the board
    }
    // the deeper the recursion, the higher the depths
    depth += 1;

    var availableMoves = getAvailableMoves(node);//calling this function to get available moves to play
    var move, result, possibleGameResult;
    if (active_turn === "HEARTS") {
        for (var i = 0; i < availableMoves.length; i++) {
            move = availableMoves[i];
            possibleGameResult = getNewState(move, node);//updated board when Astronaut Hearts plays
            result = minimax(possibleGameResult, depth, alpha, beta);//calling minimax with the updated board and depth
            node = undoMove(node, move);//calling this function to undo the move made by Astronaut Hearts
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
    } else if(active_turn="DABS") {//when active turn is of Astronaut Dabs
        for (var i = 0; i < availableMoves.length; i++) {
            move = availableMoves[i];
            possibleGameResult = getNewState(move, node);//updated board when Astronaut Dabs plays
            result = minimax(possibleGameResult, depth, alpha, beta);//calling minimax with the updated board and depth
            node = undoMove(node, move);//calling this function to undo the move made by Astronaut Dabs
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
        return  10-depth;
    } else if (score === 3) {
        return  depth-10;
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
    if (active_turn === "DABS") {
        piece = 'X';
        active_turn = "HEARTS";
    } else {
        piece = 'O';
        active_turn = 'DABS';
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
//   2 if HEARTS wins//HEARTS
//   3 if DABS wins//DABS
function checkWinningCondition(currentBoard) {
    if(BOARD_SIZE === 9){//check for horizontal lines
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
    return 1;
    }
    else if(BOARD_SIZE===16){//check for horizontal lines
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
        for (i = 0; i <= 20; i += 5) {//check for horizontal lines
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

//to check whether the game is over or not , and if it is over display the result 
function isGameOver(board) {
    var y= checkWinningCondition(board);
    if (y === 0) {
        return false;//game is not over
    } else if (y === 1) {
        var turnInfo = document.getElementById("turnInfo");
        tieSound.play();
        turnInfo.innerHTML = messages[0];//It is a tie
    } else if (y === 2) {
        var turnInfo = document.getElementById("turnInfo");
        winSound.play();
        turnInfo.innerHTML = messages[1];//Astronaut Heart wins
    } else {
        var turnInfo = document.getElementById("turnInfo");
        winSound.play();
        turnInfo.innerHTML = messages[2];//Astronaut Dabs wins
    }
    return true;
}
