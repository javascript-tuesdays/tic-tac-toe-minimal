
function Board($board) {
    this.$board = $board;
    // Collect the board elements (squares) into a 2D array, and store in this.rows.
    var $squares = $(".square");
    var rows = [];
    var i = 0;
    for (var row=0; row<3; row++) {
        var thisRow = [];
        for (var col=0; col<3; col++) {
            thisRow.push( $squares.eq(i) );
            i++;
        }
        rows.push(thisRow);
    }
    this.rows = rows;
}

Board.prototype.emptyBoard = function(){
    for (var row=0; row<3; row++) {
        for (var col=0; col<3; col++) {
            this.setSquare(row,col,'-');
        }
    }
};

Board.prototype.setSquare = function(row,col,val){
    this.getSquare(row,col).text(val);
};

Board.prototype.getSquare = function(row,col){
    return this.rows[row][col];
};

Board.prototype.isEmpty = function(row,col){
    return this.isElementEmpty( this.getSquare(row,col) );
};

Board.prototype.isElementEmpty = function($square){
    return $square.text() == "-";
};

Board.prototype.contentsOfSquare = function(row,col){
    return this.getSquare(row,col).text();
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
        if (this.contentsOfSquare(row,col) != mark) {
            return false;
        }
    }
    return true;
};

Board.prototype.playerOwnsColumn = function(col, mark){
    for (var row=0; row<3; row++){
        if (this.contentsOfSquare(row,col) != mark) {
            return false;
        }
    }
    return true;
};

Board.prototype.playerOwnsFirstDiagonal = function(mark){
    for (var row=0; row<3; row++){
        var col = row;
        if (this.contentsOfSquare(row,col) != mark) {
            return false;
        }
    }
    return true;
};

Board.prototype.playerOwnsSecondDiagonal = function(mark){
    for (var row=0; row<3; row++){
        var col = 2 - row;
        if (this.contentsOfSquare(row,col) != mark) {
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
            board.setSquare(row, col, 'X');
            this.endTurn();
        },

        endTurn: function(){

            // Is there a winner now?
            var winner = board.lookForWinner();
            if (winner) {
                $instructions.text("Player "+winner+" has won!");
                this.endGame();
                return;
            }

            // Is the board full?
            if (board.isBoardFull()) {
                $instructions.text("Game over.  There was no winner.");
                this.endGame();
                return;
            }

            // Otherwise we proceed to the next turn
            whichPlayer = (whichPlayer + 1) % 2;
            this.startNextTurn();

        },

        endGame: function(){
            setTimeout( function(){
                game.startNewGame();
            }, 4000);
        }

    };

};



var game = new Game();

game.startNewGame();

