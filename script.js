const GameBoard = (() =>{ 
    const gameBoard = [["", "", ""],
                       ["", "", ""], 
                       ["", "", ""]]

    const getGameBoard = () => gameBoard;
    const getCol = (colNumber) => gameBoard.map((row,rowIdx) => gameBoard[rowIdx][colNumber]);
    const getAllCols = () => [getCol(0), getCol(1), getCol(2)];
    
    const markACell = (row, col, playerMark) => {(gameBoard[row][col])? console.log("Invalid Place") : gameBoard[row][col] = playerMark};

    return {getGameBoard, markACell, getCol, getAllCols};
})();

const createPlayer = (playerName, playerMarker) =>{
    let name = playerName;
    const marker = playerMarker;

    return {name, marker};
};

const GameControl = (() => {
    let GameIsEnded = false;

    const player1 = createPlayer("player1" , "X");
    const player2 = createPlayer("player2" , "O");

    let activePlayer = player1;

    const switchActivePlayer = () =>{
        activePlayer = (activePlayer === player1)? player2 : player1;
    };

    const checkForWinner = () => {
        const board = GameBoard.getGameBoard();
        const boardCols = GameBoard.getAllCols();

        const numberOfXs = board.flat().filter((cell) => cell == "X").length; // converting the array to 1D and getting the number of "X"s
        const numberOfOs = board.flat().filter((cell) => cell == "O").length; // the same thing but for "O"s

        // 1- if all the cells of a single row or column are "X" or "O" (horizontal or vertical line)
        // -2 if every cell on the same column as the row number contains "X" or "Y" (i.e., [1][1], [2][2], [3][3])(diagonal line)
        if ( (board.some( (row) => row.every( (cell) => cell == "X" ) || row.every( (cell) => cell == "O" ) )) ||
           (boardCols.some( (col) => col.every( (cell) => cell == "X" ) || col.every( (cell) => cell == "O" ) ))  ||

           ( (board.every((row, rowIdx) => board[rowIdx][rowIdx] == "X")) || (board.every((row, rowIdx) => board[rowIdx][rowIdx] == "O")) ) || 
           ( (board.toReversed().every((row, rowIdx, reversedBoard) => reversedBoard[rowIdx][rowIdx] == "X")) || (board.toReversed().every((row, rowIdx, reversedBoard) => reversedBoard[rowIdx][rowIdx] == "O")) ) )
           {
               GameIsEnded = true;
                return (numberOfXs > numberOfOs)? `${player1.name} wins` : `${player2.name} wins`;

           }else if(numberOfOs + numberOfXs === board.flat().length){
                GameIsEnded = true;
                return "Tie";
           }; 
    };

    const playATurn = (row, col) => {
        if (GameIsEnded) return "The Game Ended"

        GameBoard.markACell(row, col, activePlayer.marker);
        console.log(GameBoard.getGameBoard());

        switchActivePlayer();
        console.log(checkForWinner());
        console.log(`It's now ${activePlayer.name}'s turn`); 
    }

    return {playATurn};
})();
