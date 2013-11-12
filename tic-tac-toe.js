
function Board() {
    // ...
}

Board.prototype.emptyBoard = function(){
    // ...
};

Board.prototype.setSquareValue = function(row,col,val){
    // ...
};

Board.prototype.getSquareValue = function(row,col){
    // ...
};

Board.prototype.getSquareElement = function(row,col){
    // ...
};

Board.prototype.isEmpty = function(row,col){
    // ...
};

Board.prototype.isBoardFull = function(){
    var isFull = true;
    for (var row=0; row<3; row++) {
        for (var col=0; col<3; col++) {
            if (this.isEmpty(row,col)) {
                isFull = false;
            }
        }
    }
    return isFull;
};

// These following are specific to the rules of tic-tac-toe, so could go in a 'rules' object.

Board.prototype.lookForWinner = function(){
    var players = ["O", "X"];
    for (var player=0; player<players.length; player++) {
        var mark = players[player];
        for (var row=0; row<3; row++) {
            if (this.playerOwnsRow(row, mark)) {
                return mark;
            }
        }
        for (var col=0; col<3; col++) {
            if (this.playerOwnsColumn(col, mark)) {
                return mark;
            }
        }
        if (this.playerOwnsFirstDiagonal(mark)) {
            return mark;
        }
        if (this.playerOwnsSecondDiagonal(mark)) {
            return mark;
        }
    }
    return null;
};

Board.prototype.playerOwnsRow = function(row, mark){
    for (var col=0; col<3; col++){
        if (this.getSquareValue(row,col) != mark) {
            return false;
        }
    }
    return true;
};

Board.prototype.playerOwnsColumn = function(col, mark){
    for (var row=0; row<3; row++){
        if (this.getSquareValue(row,col) != mark) {
            return false;
        }
    }
    return true;
};

Board.prototype.playerOwnsFirstDiagonal = function(mark){
    for (var row=0; row<3; row++){
        var col = row;
        if (this.getSquareValue(row,col) != mark) {
            return false;
        }
    }
    return true;
};

Board.prototype.playerOwnsSecondDiagonal = function(mark){
    for (var row=0; row<3; row++){
        var col = 2 - row;
        if (this.getSquareValue(row,col) != mark) {
            return false;
        }
    }
    return true;
};



function Game() {

    // Grab relevant elements
    var $board = $(".board");
    var $instructions = $(".instructions");

    // Game state
    var board = new Board($board);
    var whichPlayer = 0;

    function playerMarkSquare() {
        if (whichPlayer != 0) {
            $instructions.text("It is not your turn!");
            return;
        }
        var $square = $(this);
        console.log("Player chose:",$square);
        if (board.isElementEmpty($square)) {
            $square.text("O");
            game.endTurn();
        } else {
            $instructions.text("You cannot place on that square.  Try again!");
        }
    }

    $(".square",$board).on("click", playerMarkSquare);

    return {

        startNewGame: function(){
            board.emptyBoard();
            whichPlayer = 0;
            this.startNextTurn();
        },

        startNextTurn: function(){
            if (whichPlayer == 0) {
                $instructions.text("Choose a square.");
            } else {
                $instructions.text("Computer is playing.");
                this.computerPlay();
            }
        },

        computerPlay: function(){
            // Pick a random empty square
            var attempts = 0;
            while (true) {
                var row = Math.random() * 3 | 0;
                var col = Math.random() * 3 | 0;
                if (board.isEmpty(row,col)) {
                    break;
                }
                if (++attempts >= 1000) {
                    $instructions.text("Error: Failed to find an empty square after "+attempts+" attempts!");
                    return;
                }
            }
            console.log("Computer chose "+row+","+col);
            board.setSquareValue(row, col, 'X');
            this.endTurn();
        },

        endTurn: function(){

            // Is there a winner now?
            // ...

            // Is the board full?  If so, the game is over and there was no winner.
            // ...

            // Otherwise we proceed to the next turn
            whichPlayer = (whichPlayer + 1) % 2;
            this.startNextTurn();

        },

        endGame: function(){
            // The results of the game have already been presented.
            // Now we will wait to start a new game.
            // We could wait for the user to click a (New Game) button.
            // Or we could just automatically start a new game, after a timeout.
            // ...
        }

    };

};



var game = new Game();

game.startNewGame();

