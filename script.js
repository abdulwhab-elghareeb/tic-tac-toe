
const gameBoard = (() =>{ 
    const gameArray = [["", "", ""],
                       ["", "", ""], 
                       ["", "", ""]];

    const getGameBoard = () => gameArray;
    const getFlatGameBoard = () => gameArray.flat();

    const getCol = (colNumber) => gameArray.map((row,rowIdx) => gameArray[rowIdx][colNumber]);
    const getAllCols = () => [getCol(0), getCol(1), getCol(2)];

    const resetBoard = () => gameArray.forEach((row,rowIdx) => row.forEach((col, colIdx) => {
        gameArray[rowIdx][colIdx] = "";
    }));
    
    const markACell = (row, col, playerMark) => (gameArray[row][col])? false : gameArray[row][col] = playerMark;

    return {getGameBoard, getFlatGameBoard, getAllCols, markACell, resetBoard};
})();

const createPlayer = (playerName, playerMarker) =>{
    let name = playerName;
    const marker = playerMarker;
    let score = 0;
    getPlayerScore = () => score;
    incrementPlayerScore = () => score++;
    resetPlayerScore = () => score = 0;


    return {name, marker, getPlayerScore, incrementPlayerScore, resetPlayerScore};
};

const gameController = (() => {
    const board = gameBoard.getGameBoard();

    let gameIsEnded = false;
    const getGameState = () => gameIsEnded;

    let result = "";
    const getResult = () => result;

    const player1 = createPlayer("player1" , "X");
    const player2 = createPlayer("player2" , "O");


    let activePlayer = player1;
    const switchActivePlayer = () =>{
        activePlayer = (activePlayer === player1)? player2 : player1;
    };

    const getActivePlayer = () => activePlayer;

    const checkForWinner = () => {
        const boardCols = gameBoard.getAllCols();
        const flatBoard = gameBoard.getFlatGameBoard();

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
                if(numberOfXs > numberOfOs){
                    player1.incrementPlayerScore()
                    result = player1;

                }else{
                    player2.incrementPlayerScore()
                    result = player2;
                }

           }else if(numberOfOs + numberOfXs === flatBoard.length){
                gameIsEnded = true;
                result = "";
           };
    };
    const getWinningMethod = () =>{
        if (!(result == player1 || result == player2)) return
        let winMethod;
        // 1- horizontal lines 
        const boardCols = gameBoard.getAllCols()

        if (board.some( (row) => row.every( (cell) => cell == "X" ) || row.every( (cell) => cell == "O" ))){
            winMethod = "horizontal line"
            for(const row of board){
                if (row.every((col) => col == "X"  || row.every((col) => col == "O"))){
                    return {winMethod, row: board.indexOf(row)}
                }
            }
        // -2 vertical lines
        }else if (boardCols.some( (col) => col.every( (cell) => cell == "X" ) || col.every( (cell) => cell == "O" ))){
            winMethod = "vertical line"
            for (const col of boardCols){
                if (col.every((cell) => cell == "X"  || col.every((cell) => cell == "O"))){
                    return {winMethod, col: boardCols.indexOf(col)}
                }
            }
        }else{
            winMethod = "diagonal line"
            if((board.every((row, rowIdx) => board[rowIdx][rowIdx] == "X")) || (board.every((row, rowIdx) => board[rowIdx][rowIdx] == "O"))){
                return {winMethod, col: [0, 1 ,2], row: [0, 1 ,2]};
            }else {
                return {winMethod, col: [2, 1, 0], row: [0, 1, 2]}
            }
        }
    
    }
    const playATurn = (row, col) => {
        if (gameIsEnded) return "The Game Ended";
        
        if (gameBoard.markACell(+row, +col, activePlayer.marker)){// if it's not an invalid spot
            switchActivePlayer();
            checkForWinner();
        }; // return here later
    };

    const resetRound = () => {
        gameIsEnded = false;
        activePlayer = player1;
        gameBoard.resetBoard();
        result = "";
    }
    const resetGame = () =>{
        gameIsEnded = false;
        activePlayer = player1;
        gameBoard.resetBoard();
        result = "";
        player1.resetPlayerScore()
        player2.resetPlayerScore()
    }
    return {player1, player2, playATurn, resetGame, resetRound, checkForWinner, getActivePlayer, getResult, getGameState, getWinningMethod};
})();

const displayController = (() => {
    const board = gameBoard.getGameBoard();

    function updateResultText(){
        const gameResult = gameController.getResult()
        const player1 = gameController.player1;
        const player2 = gameController.player2;
        const winnerSpan = document.querySelector(".winner")
        const textSpan = document.querySelector(".text")

        if (!(gameController.getGameState())){
            winnerSpan.textContent = ""
            textSpan.textContent = ""
            return
        }

        switch(gameResult){
            case player1:
                winnerSpan.textContent = player1.name;
                winnerSpan.style.color = "hsl(from var(--cinnabar) h s calc(l - 10))";
                textSpan.textContent = " wins";
                break;
            case player2:
                winnerSpan.textContent = player2.name;
                winnerSpan.style.color = "hsl(from var(--pacific-blue) h s calc(l - 10))";
                textSpan.textContent = " wins";
                break;
            default:
                textSpan.textContent = "Tie"
        }
            
    };
    
    function renderBoard(){
        const gameGrid = document.querySelector(".game-grid");
        
        board.forEach((row, rowIdx) => board[rowIdx].forEach((col, colIdx) =>{
            const cellBtn = document.createElement("button");
            cellBtn.classList.add("cell");
            cellBtn.setAttribute("data-col", colIdx);
            cellBtn.setAttribute("data-row", rowIdx);

            gameGrid.appendChild(cellBtn);
        }));
    };

    function updateDisplayedBoard(){
        const cells = Array.from(document.querySelectorAll(".cell"));
        cells.forEach((cell) =>{
            cell.textContent = board[cell.getAttribute("data-row")][cell.getAttribute("data-col")];

            if (cell.textContent == "X"){
                cell.classList.add("markerX");
                cell.classList.remove("markerO");
                
            }else if (cell.textContent == "O"){
                cell.classList.add("markerO");
                cell.classList.remove("markerX");

            }else{
                cell.classList.remove("markerO", "markerX")
            }
        });
    };

    function updateDisplayNames(){
        const player1Input = document.querySelector("#player1-name");
        const player2Input = document.querySelector("#player2-name");

        player1Input.value = gameController.player1.name;
        player2Input.value = gameController.player2.name;
    };

    function updateDisplayScores(){

        const player1Score = document.querySelector(".player1 > .score")
        const player2Score = document.querySelector(".player2 > .score")

        player1Score.textContent = gameController.player1.getPlayerScore();
        player2Score.textContent = gameController.player2.getPlayerScore();
    }
    function displayWinMethod(){
        
        if (!gameController.getGameState()){
            const cells = document.querySelectorAll(".cell")
            cells.forEach((cell) => cell.classList.remove("winningX", "winningO"))
            return
        }
        let cells;
        switch (gameController.getWinningMethod().winMethod){
            case "horizontal line" :
                cells = Array.from(document.querySelectorAll(`[data-row = '${gameController.getWinningMethod().row}']`));
                cells.forEach((cell) => (gameController.getResult() == gameController.player1)? cell.classList.add("winningX") : cell.classList.add("winningO"));
                break;
            case "vertical line" :
                cells = Array.from(document.querySelectorAll(`[data-col = '${gameController.getWinningMethod().col}']`));
                cells.forEach((cell) => (gameController.getResult() == gameController.player1)? cell.classList.add("winningX") : cell.classList.add("winningO"));
                break;

            default :
                const cell1 = document.querySelector(`[data-row = '${gameController.getWinningMethod().row[0]}'][data-col = '${gameController.getWinningMethod().col[0]}']`);
                const cell2 = document.querySelector(`[data-row = '${gameController.getWinningMethod().row[1]}'][data-col = '${gameController.getWinningMethod().col[1]}']`);
                const cell3 = document.querySelector(`[data-row = '${gameController.getWinningMethod().row[2]}'][data-col = '${gameController.getWinningMethod().col[2]}']`);
                [cell1, cell2, cell3].forEach((cell) => (gameController.getResult() == gameController.player1)? cell.classList.add("winningX") : cell.classList.add("winningO"));
            }
    }
    renderBoard() ;
    updateDisplayNames()
    updateDisplayScores();

    return {updateResultText, updateDisplayedBoard, updateDisplayNames, updateDisplayScores,displayWinnerPattern: displayWinMethod};
})()
    
const eventsHandlers = (() => {
    board = gameBoard.getGameBoard();

    const cells = Array.from(document.querySelectorAll(".cell"));
    function cellClickHandler(e){
        targetCol = e.target.getAttribute("data-col");
        targetRow = e.target.getAttribute("data-row");

        gameController.playATurn(targetRow, targetCol);
        displayController.updateDisplayedBoard();
        displayController.updateResultText();
        displayController.updateDisplayScores();
        displayController.displayWinnerPattern()
    };

    function cellsMouseoverEventHandler(e){
        if(gameController.getGameState() || e.target.textContent !== "" ){
            e.target.style.cursor = "not-allowed"
            e.target.style.background = "hsl(from gray h s calc(l + 20))"

        }else if(gameController.getActivePlayer().marker === "X"){
            e.target.style.cursor = "pointer"
            e.target.style.background = "hsl(from var(--cinnabar) h s calc(l + 20))"

        }else{
            e.target.style.cursor = "pointer"
            e.target.style.background = "hsl(from var(--pacific-blue) h s calc(l + 30))";
        }
    };

    function cellsMouseoutEventHandler(e){
        (gameController.getActivePlayer().marker === "X")? e.target.style.background = "" : e.target.style.background = "";
    };
    
    cells.forEach((cell) => cell.addEventListener("click", cellClickHandler));
    cells.forEach((cell => cell.addEventListener("mouseover", cellsMouseoverEventHandler)))
    cells.forEach((cell => cell.addEventListener("mouseout", cellsMouseoutEventHandler)))


    const resetRoundBtn = document.querySelector(".reset-round")
    const resetGameBtn = document.querySelector(".reset-game")

    function resetGameClickHandler(e){
        gameController.resetGame();
        displayController.updateDisplayedBoard();
        displayController.updateResultText();
        displayController.updateDisplayScores();
        displayController.displayWinnerPattern()
    };

    function resetRoundClickHandler(e){
        gameController.resetRound();
        displayController.updateDisplayedBoard();
        displayController.updateResultText();
        displayController.displayWinnerPattern()
    }
    resetGameBtn.addEventListener("click", resetGameClickHandler)
    resetRoundBtn.addEventListener("click", resetRoundClickHandler);


    const labels = Array.from(document.querySelectorAll("label"));
    const inputs = Array.from(document.querySelectorAll("input"));
    
    function labelsClickHandler(e){// removes readonly from the input that is linked to the clicked label
        inputId = e.target.getAttribute("for");
        document.querySelector(`input#${inputId}`).removeAttribute("readonly")
    }
    
    function inputsChangeHandler(e){// gives the input readonly and updates player name
        if (e.target.value.length < 2){
            e.target.value = gameController[`player${e.target.getAttribute("id").at(6)}`].name;
            return 
        } 
        
        e.target.setAttribute("readonly", true)
        gameController[`player${e.target.getAttribute("id").at(6)}`].name = e.target.value;
        displayController.updateResultText()
    }

    labels.forEach((label) => label.addEventListener("click", labelsClickHandler))
    inputs.forEach((input) => input.addEventListener("change", inputsChangeHandler))


})()
