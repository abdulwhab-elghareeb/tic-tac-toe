const gameBoard = (() =>{ 
    const gameArray = [["", "", ""],
                       ["", "", ""], 
                       ["", "", ""]];

    const getGameBoard = () => gameArray;

    const getCol = (colNumber) => gameArray.map((row,rowIdx) => gameArray[rowIdx][colNumber]);
    const getAllCols = () => [getCol(0), getCol(1), getCol(2)];

    const resetBoard = () => gameArray.forEach((row,rowIdx) => row.forEach((col, colIdx) => {
        gameArray[rowIdx][colIdx] = "";
    }));
    
    const markACell = (row, col, playerMark) => gameArray[row][col] = playerMark;

    return {getGameBoard, getAllCols, markACell, resetBoard};
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

    let roundEnded = false;
    const getRoundEnded = () => roundEnded;

    let result = "";
    const getResult = () => result;

    const player2 = createPlayer("player2" , "O");
    const player1 = createPlayer("player1" , "X");
    let activePlayer = player1;
    const getActivePlayer = () => activePlayer;
    const switchActivePlayer = () =>{
        activePlayer = (activePlayer === player1)? player2 : player1;
    };

    const checkForWinner = () => {
        const board = gameBoard.getGameBoard()
        const boardCols = gameBoard.getAllCols();
        const flatBoard = board.flat()
    
        const numberOfXs = flatBoard.filter((cell) => cell == "X").length; // converting the array to 1D and getting the number of "X"s
        const numberOfOs = flatBoard.filter((cell) => cell == "O").length; // the same thing but for "O"s

        // 1- if all the cells of a single row or column contains "X" or "O" (horizontal or vertical line)
        // -2 if every cell on the same column as the row number contains "X" or "O" (i.e., [1][1], [2][2], [3][3])(diagonal line)
        if ((board.some((row) => row.every((cell) => cell == "X") || row.every((cell) => cell == "O"))) ||  (boardCols.some((col) => col.every( (cell) => cell == "X" ) || col.every((cell) => cell == "O" )))  
            ||
           ((board.every((row, rowIdx) => board[rowIdx][rowIdx] == "X")) || (board.every((row, rowIdx) => board[rowIdx][rowIdx] == "O"))) ||  ((board.toReversed().every((row, rowIdx, reversedBoard) => reversedBoard[rowIdx][rowIdx] == "X")) || (board.toReversed().every((row, rowIdx, reversedBoard) => reversedBoard[rowIdx][rowIdx] == "O"))))
           {
            roundEnded = true;
                if(numberOfXs > numberOfOs){
                    player1.incrementPlayerScore();
                    result = player1;

                }else{
                    player2.incrementPlayerScore();
                    result = player2;
                }

           }else if(numberOfOs + numberOfXs === flatBoard.length){
            roundEnded = true;
                result = "";
           };
    };

    const getWinningMethod = () =>{// gets the way that user won with horizontal/vertical/diagonal line
        const board = gameBoard.getGameBoard();
        const boardCols = gameBoard.getAllCols();
        if (!(result == player1 || result == player2)) return; // don't run if neither of the players won

        let winningMethod;
        //horizontal lines 
        if (board.some((row) => row.every( (cell) => cell == "X" ) || row.every((cell) => cell == "O"))){
            winningMethod = "horizontal line";
            for(const row of board){
                if (row.every((col) => col == "X"  || row.every((col) => col == "O"))){
                    return {winningMethod, row: board.indexOf(row)}; // returns win method and the row
                };
            };
        // vertical lines
        }else if (boardCols.some( (col) => col.every( (cell) => cell == "X" ) || col.every( (cell) => cell == "O" ))){
            winningMethod = "vertical line";
            for (const col of boardCols){
                if (col.every((cell) => cell == "X"  || col.every((cell) => cell == "O"))){
                    return {winningMethod, col: boardCols.indexOf(col)};// returns win method and the column
                };
            };
        }else{ // diagonal line
            winningMethod = "diagonal line";
            if((board.every((row, rowIdx) => board[rowIdx][rowIdx] == "X")) || (board.every((row, rowIdx) => board[rowIdx][rowIdx] == "O"))){
                return {winningMethod, col: [0, 1 ,2], row: [0, 1 ,2]}; // returns win method and array of columns and rows that makes a diagonal line
            }else{
                return {winningMethod, col: [2, 1, 0], row: [0, 1, 2]}; // returns win method and array of columns and rows that makes a diagonal line
            };
        };
    };

    const playATurn = (row, col) => {
        if (roundEnded || board[row][col]) return; // don't run if the round ended or board cell is already taken

        gameBoard.markACell(row, col, activePlayer.marker);
        switchActivePlayer();
        checkForWinner();
    };

    const resetRound = () => {
        roundEnded = false;
        activePlayer = player1;
        gameBoard.resetBoard();
        result = "";
    };

    const resetGame = () =>{
        resetRound();
        player1.resetPlayerScore();
        player2.resetPlayerScore();
    };

    return {player1, player2, playATurn, resetGame, resetRound, getActivePlayer, getResult, getRoundEnded, getWinningMethod};
})();


const displayController = (() => {
    const board = gameBoard.getGameBoard();

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

    function updateDisplayBoard(){
        const cells = Array.from(document.querySelectorAll(".cell"));

        cells.forEach((cell) =>{
            cell.textContent = board[cell.getAttribute("data-row")][cell.getAttribute("data-col")];
            switch(cell.textContent){
                case "X" :
                    cell.classList.add("markerX");
                    cell.classList.remove("markerO");
                    break

                case "O":
                    cell.classList.add("markerO");
                    cell.classList.remove("markerX");
                    break
            };
        });
    };

    function updateDisplayNames(){
        const player1Input = document.querySelector("#player1-name");
        const player2Input = document.querySelector("#player2-name");

        player1Input.value = gameController.player1.name;
        player2Input.value = gameController.player2.name;
    };

    function updateDisplayScores(){
        const player1Score = document.querySelector(".player1 > .score");
        const player2Score = document.querySelector(".player2 > .score");

        player1Score.textContent = gameController.player1.getPlayerScore();
        player2Score.textContent = gameController.player2.getPlayerScore();
    };

    function updateResultText(){
        const player1 = gameController.player1;
        const player2 = gameController.player2;

        const winnerPlayerSpan = document.querySelector(".winner-player");
        const textSpan = document.querySelector(".winner-text");

        if (!gameController.getRoundEnded()){// if this method is called when the game is not ended yet then reset spans textContent
            winnerPlayerSpan.textContent = "";
            textSpan.textContent = "";
            return;
        };

        switch(gameController.getResult()){ // coloring the text of the span differently depending on the winner
            case player1:
                winnerPlayerSpan.textContent = player1.name;
                winnerPlayerSpan.style.color = "hsl(from var(--cinnabar) h s calc(l - 10))";
                textSpan.textContent = " wins";
                break;

            case player2:
                winnerPlayerSpan.textContent = player2.name;
                winnerPlayerSpan.style.color = "hsl(from var(--pacific-blue) h s calc(l - 10))";
                textSpan.textContent = " wins";
                break;

            default:
                textSpan.textContent = "Tie";
        };
            
    };
    
    function displayWinningMethod(){// indicates how the player won by changing the background color of the horizontal/vertical/diagonal line 
        const winningMethodObject = gameController.getWinningMethod();

        if (!gameController.getRoundEnded() || gameController.getResult() == ""){ // if the game is still going  or it's a tie 
            const cells = document.querySelectorAll(".cell");
            cells.forEach((cell) => cell.classList.remove("winningX", "winningO"));
            return
        };
        let cells;
        switch (winningMethodObject.winningMethod){ 
            case "horizontal line" : // if win method is horizontal line then change the background color of all cells on that row 
                cells = Array.from(document.querySelectorAll(`[data-row = '${winningMethodObject.row}']`));
                cells.forEach((cell) => (gameController.getResult() == gameController.player1)? cell.classList.add("winningX") : cell.classList.add("winningO"));
                break;

            case "vertical line" : // if win method is vertical line then change the background color of all cells on that column 
                cells = Array.from(document.querySelectorAll(`[data-col = '${winningMethodObject.col}']`));
                cells.forEach((cell) => (gameController.getResult() == gameController.player1)? cell.classList.add("winningX") : cell.classList.add("winningO"));
                break;

            case "diagonal line" : // if win method is diagonal line then get each cell of the diagonal line and change it's background color
                const cell1 = document.querySelector(`[data-row = '${winningMethodObject.row[0]}'][data-col = '${winningMethodObject.col[0]}']`);
                const cell2 = document.querySelector(`[data-row = '${winningMethodObject.row[1]}'][data-col = '${winningMethodObject.col[1]}']`);
                const cell3 = document.querySelector(`[data-row = '${winningMethodObject.row[2]}'][data-col = '${winningMethodObject.col[2]}']`);
                [cell1, cell2, cell3].forEach((cell) => (gameController.getResult() == gameController.player1)? cell.classList.add("winningX") : cell.classList.add("winningO"));
            };
    };

    function updateAll(){
        updateDisplayBoard();
        updateResultText();
        updateDisplayScores();
        displayWinningMethod();
    };

    renderBoard();
    updateDisplayNames();
    updateDisplayScores();

    return {updateAll};
})();
    

const eventsHandler = (() => { 
    const cells = Array.from(document.querySelectorAll(".cell"));
    function cellClickHandler(e){
        targetCol = e.target.getAttribute("data-col");
        targetRow = e.target.getAttribute("data-row");

        gameController.playATurn(targetRow, targetCol);
        displayController.updateAll();
    };
    cells.forEach((cell) => cell.addEventListener("click", cellClickHandler));

    function cellsMouseoverEventHandler(e){
        if( gameController.getRoundEnded() || e.target.textContent !== "" ){// if round ended or the cell is already taken
            e.target.style.cursor = "not-allowed";

        }else if(gameController.getActivePlayer().marker === "X"){
            e.target.style.cursor = "pointer";
            e.target.style.background = "hsl(from var(--cinnabar) h s calc(l + 20))";

        }else{
            e.target.style.cursor = "pointer";
            e.target.style.background = "hsl(from var(--pacific-blue) h s calc(l + 30))";
        };
    };
    cells.forEach((cell => cell.addEventListener("mouseover", cellsMouseoverEventHandler)));

    function cellsMouseoutEventHandler(e){
        (gameController.getActivePlayer().marker === "X")? e.target.style.background = "" : e.target.style.background = "";
    };
    cells.forEach((cell => cell.addEventListener("mouseout", cellsMouseoutEventHandler)));


    const resetGameBtn = document.querySelector(".reset-game");
    function resetGameClickHandler(e){
        gameController.resetGame();
        displayController.updateAll();
    };
    resetGameBtn.addEventListener("click", resetGameClickHandler);
    
    const resetRoundBtn = document.querySelector(".reset-round")
    function resetRoundClickHandler(e){
        gameController.resetRound();
        displayController.updateAll();
    };
    resetRoundBtn.addEventListener("click", resetRoundClickHandler);
    

    // changing player name
    const labels = Array.from(document.querySelectorAll("label"));
    function labelsClickHandler(e){// removes readonly from the input that is linked to the clicked label
        inputId = e.target.getAttribute("for");
        document.querySelector(`input#${inputId}`).removeAttribute("readonly");
    }
    labels.forEach((label) => label.addEventListener("click", labelsClickHandler));
    
    const inputs = Array.from(document.querySelectorAll("input"));
    function inputsChangeHandler(e){// gives the input readonly and updates player name
        if (e.target.value.length < 2){
            e.target.value = gameController[`player${e.target.getAttribute("id").at(6)}`].name;
            return 
        };

        e.target.setAttribute("readonly", true)
        gameController[`player${e.target.getAttribute("id").at(6)}`].name = e.target.value;
        displayController.updateAll();
    };
    inputs.forEach((input) => input.addEventListener("change", inputsChangeHandler));
    // changing player name
})();
