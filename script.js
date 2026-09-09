const GameBoard = (() =>{ 
    const gameBoard = [["", "", ""],
                       ["", "", ""], 
                       ["", "", ""]]
                     // making the gameBoard's 2d array

    const getGameBoard = () => gameBoard;
    const getCol = (colNumber) => [gameBoard[0][colNumber], gameBoard[1][colNumber], gameBoard[2][colNumber]];
    const getAllCols = () => [getCol(0), getCol(1), getCol(2)];
    
    const markACell = (row, col, playerMark) => {(gameBoard[row][col])? console.log("Invalid Place") : gameBoard[row][col] = playerMark};

    return {getGameBoard, markACell, getCol, getAllCols};
})()

const createPlayer = (playerName, playerMarker) =>{
    let name = playerName;
    const marker = playerMarker;

    return {name, marker};
};

const GameControl = (() => {
    // starts by creating the players
    const player1 = createPlayer("player1" , "X");
    const player2 = createPlayer("player2" , "O");

    let activePlayer = player1; // for the first round

    const switchActivePlayer = () =>{
        activePlayer = (activePlayer === player1)? player2 : player1;
    } // switch between players

    const checkForWinner = () => {
        const board = GameBoard.getGameBoard();
        const boardCols = GameBoard.getAllCols();

        const numberOfXs = board.flat().filter((cell) => cell == "X").length; // converting the array to 1D and getting the number of "X"s
        const numberOfOs = board.flat().filter((cell) => cell == "O").length; // the same thing but for "O"s

        const diagonalLines = [[board[0][2], board[1][1], board[2][0]], [board[0][0], board[1][1], board[2][2]]] 

        if ( (board.some( (row) => row.every( (cell) => cell == "X" ) || row.every( (cell) => cell == "O" ) )) || // horizontal line  
           (boardCols.some( (col) => col.every( (cell) => cell == "X" ) || col.every( (cell) => cell == "O" ) ))  || // vertical line

           ( (diagonalLines[0].every((cell) => cell == "X")) || (diagonalLines[0].every((cell) => cell == "O")) ) || // diagonal line from right side
           ( (diagonalLines[1].every((cell) => cell == "X")) || (diagonalLines[1].every((cell) => cell == "O")) ) )// diagonal line from left side
           { 
                return (numberOfXs > numberOfOs)? `${player1.name} wins` : `${player2.name} wins`;
                 // X > O means X wins
                 // X <= O means O wins (actually O cannot be bigger than X, because X always starts first)
           }else if(numberOfOs + numberOfXs === 9){// if there is no empty spaces left
                return "Tie"
           }      
    }

    const playATurn = (row, col) => {
        GameBoard.markACell(row, col, activePlayer.marker);
        console.log(GameBoard.getGameBoard())
        
        switchActivePlayer();
        console.log(checkForWinner())
        console.log(`It's now ${activePlayer.name}'s turn`); 
    }

    return {playATurn}; // returning only playATurn, because this the only method we will interact with
})();
