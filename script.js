
const gameBoard = (() =>{ 
    const gameArray = [["", "", ""],
                       ["", "", ""], 
                       ["", "", ""]]

    const getGameBoard = () => gameArray;
    const getFlatGameBoard = () => gameArray.flat();

    const getCol = (colNumber) => gameArray.map((row,rowIdx) => gameArray[rowIdx][colNumber]);
    const getAllCols = () => [getCol(0), getCol(1), getCol(2)];

    const resetBoard = () => gameArray.forEach((row,rowIdx) => row.forEach((col, colIdx) => {
        gameArray[rowIdx][colIdx] = ""
    }))
    
    const markACell = (row, col, playerMark) => (gameArray[row][col])? false : gameArray[row][col] = playerMark;

    return {getGameBoard, getFlatGameBoard, getAllCols, markACell, resetBoard};
})();

const createPlayer = (playerName, playerMarker) =>{
    let name = playerName;
    const marker = playerMarker;

    return {name, marker};
};

const gameController = (() => {
    const board = gameBoard.getGameBoard();

    let gameIsEnded = false;

    let result = "";
    const getResult = () => result;

    const player1 = createPlayer("player1" , "X");
    const player2 = createPlayer("player2" , "O");
    const setPlayer1Name = (newName) => {player1.name = newName;}
    const getPlayer1Name = () => player1.name;
    const setPlayer2Name = (newName) => {player2.name = newName;}
    const getPlayer2Name = () => player2.name;

    let activePlayer = player1;
    const switchActivePlayer = () =>{
        activePlayer = (activePlayer === player1)? player2 : player1;
    };

    const getActivePlayer = () => activePlayer

    const checkForWinner = () => {
        const boardCols = gameBoard.getAllCols();
        const flatBoard = gameBoard.getFlatGameBoard()

        const numberOfXs = flatBoard.filter((cell) => cell == "X").length; // converting the array to 1D and getting the number of "X"s
        const numberOfOs = flatBoard.filter((cell) => cell == "O").length; // the same thing but for "O"s

        // 1- if all the cells of a single row or column are "X" or "O" (horizontal or vertical line)
        // -2 if every cell on the same column as the row number contains "X" or "Y" (i.e., [1][1], [2][2], [3][3])(diagonal line)
        if ( (board.some( (row) => row.every( (cell) => cell == "X" ) || row.every( (cell) => cell == "O" ) )) ||
           (boardCols.some( (col) => col.every( (cell) => cell == "X" ) || col.every( (cell) => cell == "O" ) ))  ||

           ( (board.every((row, rowIdx) => board[rowIdx][rowIdx] == "X")) || (board.every((row, rowIdx) => board[rowIdx][rowIdx] == "O")) ) || 
           ( (board.toReversed().every((row, rowIdx, reversedBoard) => reversedBoard[rowIdx][rowIdx] == "X")) || (board.toReversed().every((row, rowIdx, reversedBoard) => reversedBoard[rowIdx][rowIdx] == "O")) ) )
           {
               gameIsEnded = true;
                return (numberOfXs > numberOfOs)?
                result = `${player1.name} wins` : result = `${player2.name} wins`;

           }else if(numberOfOs + numberOfXs === flatBoard.length){
                gameIsEnded = true;
                result = "Tie";

           }
    };

    const playATurn = (row, col) => {
        if (gameIsEnded) return "The Game Ended"
        
        if (gameBoard.markACell(+row, +col, activePlayer.marker)){// if it's not an invalid spot
            switchActivePlayer();
            checkForWinner();
        }
    }

    const resetGame = () => {
        gameIsEnded = false;
        activePlayer = player1;
        gameBoard.resetBoard()
        result = ""
    }

    return {playATurn, resetGame, checkForWinner, getActivePlayer, getResult, setPlayer1Name, getPlayer1Name, setPlayer2Name, getPlayer2Name};
})();

const displayController = (() => {
    const board = gameBoard.getGameBoard()

    function updateResultText(){
        const result = document.querySelector(".result")
        result.textContent = gameController.getResult()
    }
    
    function renderBoard(){
        const gameGrid = document.querySelector(".game-grid");
        
        board.forEach((row, rowIdx) => board[rowIdx].forEach((col, colIdx) =>{
            const cellBtn = document.createElement("button")
            cellBtn.classList.add("cell")
            cellBtn.setAttribute("data-col", colIdx)
            cellBtn.setAttribute("data-row", rowIdx)

            gameGrid.appendChild(cellBtn)
        }))
    }

    function updateDisplayedBoard(){
        const cells = Array.from(document.querySelectorAll(".cell"))
        cells.forEach((cell) =>{
            cell.textContent = board[cell.getAttribute("data-row")][cell.getAttribute("data-col")]
        })
    }

    function displayPlayers(){
        const player1Container = document.querySelector(".player1")
        const player2Container = document.querySelector(".player2")

        const player1NameDisplay = document.createElement("div")
        player1NameDisplay.classList.add("player1-name")
        player1NameDisplay.textContent = gameController.getPlayer1Name();

        const player2NameDisplay = document.createElement("div")
        player2NameDisplay.classList.add("player2-name")
        player2NameDisplay.textContent = gameController.getPlayer2Name()


        player1Container.append(player1NameDisplay)
        player2Container.append(player2NameDisplay)
    }
    renderBoard()
    displayPlayers()
    return {updateResultText, renderBoard, updateDisplayedBoard, displayPlayers}
})()
    
const eventHandlers = (() => {
    board = gameBoard.getGameBoard()

    const cells = Array.from(document.querySelectorAll(".cell"))
    function cellClickHandler(e){
        targetCol = e.target.getAttribute("data-col");
        targetRow = e.target.getAttribute("data-row")

        gameController.playATurn(targetRow, targetCol);
        e.currentTarget.textContent = board[targetRow][targetCol];
        displayController.updateResultText()
    }
    cells.forEach((cell) => cell.addEventListener("click", cellClickHandler))

    const resetBtn = document.querySelector(".reset")
    function resetClickHandler(e){
        gameController.resetGame()
        displayController.updateDisplayedBoard()
        displayController.updateResultText()
    }
    resetBtn.addEventListener("click", resetClickHandler);

})()
