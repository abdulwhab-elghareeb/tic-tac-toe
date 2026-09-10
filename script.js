const gameBoard = (() =>{ 
    const gameArray = [["", "", ""],
                       ["", "", ""], 
                       ["", "", ""]]

    const getGameBoard = () => gameArray;
    const getFlatGameBoard = () => gameArray.flat();

    const getCol = (colNumber) => gameArray.map((row,rowIdx) => gameArray[rowIdx][colNumber]);
    const getAllCols = () => [getCol(0), getCol(1), getCol(2)];
    
    const markACell = (row, col, playerMark) => (gameArray[row][col])? false : gameArray[row][col] = playerMark;

    return {getGameBoard, getFlatGameBoard, getAllCols, markACell, };
})();

const createPlayer = (playerName, playerMarker) =>{
    let name = playerName;
    const marker = playerMarker;

    return {name, marker};
};

const gameController = (() => {
    const board = gameBoard.getGameBoard();

    let GameIsEnded = false;

    let result = "";
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
    const getResult = () => result;

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
               GameIsEnded = true;
                return (numberOfXs > numberOfOs)?
                result = `${player1.name} wins` : result = `${player2.name} wins`;

           }else if(numberOfOs + numberOfXs === flatBoard.length){
                GameIsEnded = true;
                result = "Tie";
           }; 
    };

    const playATurn = (row, col) => {
        if (GameIsEnded) return "The Game Ended"

        if (gameBoard.markACell(+row, +col, activePlayer.marker)){// if it's not an invalid spot
            switchActivePlayer();
            checkForWinner();
        }
    }

    return {playATurn, checkForWinner, getActivePlayer, getResult, setPlayer1Name, getPlayer1Name, setPlayer2Name, getPlayer2Name};
})();

const displayController = (() => {
    const board = gameBoard.getGameBoard()

    const displayText = (()=>{
        const resultContainer = document.querySelector(".result-container")

        const result = document.createElement("div")
        result.classList.add("result")
        resultContainer.appendChild(result)

        const updateResultText = () => {
            result.textContent = gameController.getResult()
        }
        
        return {updateResultText}
    })()

    const renderBoard = (() =>{
        const gameGrid = document.querySelector(".game-grid");
        
        board.forEach((row, rowIdx) => board[rowIdx].forEach((col, colIdx) =>{
            const cellBtn = document.createElement("button")
            cellBtn.classList.add("cell")
            cellBtn.setAttribute("data-col", colIdx)
            cellBtn.setAttribute("data-row", rowIdx)
            console.log(rowIdx, colIdx)

            gameGrid.appendChild(cellBtn)
        }))
    })()

    const addListeners = (() =>{
        const cells = document.querySelectorAll(".cell")
            cells.forEach((cell) => {
                cell.addEventListener("click", (e) =>{
                    targetRow = e.target.getAttribute("data-row")
                    targetCol = e.target.getAttribute("data-col")
                    
                    gameController.playATurn(targetRow, targetCol)
                    cell.textContent = board[targetRow][targetCol]
                    displayText.updateResultText()
                })
            })
    })()

    const displayPlayers = (() =>{
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
    })()
})();

