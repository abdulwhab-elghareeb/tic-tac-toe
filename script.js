const GameBoard = (() =>{ 

    const gameBoard=[["", "", ""],
                     ["", "", ""], 
                     ["", "", ""]]
                     // making the gameBoard 2d array

    const getGameBoard = () => gameBoard; // getting the gameBoard

    const markACell = (row, column, playerMark) => {gameBoard[row][column] = playerMark;} // marking the cell by it's row and column index using player.marker 
    // could add a check if the place is already checked so it's invalid but that's a later thing

    return {getGameBoard, markACell};
})()

const createPlayer = (playerName, playerMarker) =>{
    let name = playerName;
    const marker = playerMarker;
    // player object doesn't need to have any methods, really they just need to exist, gameControl will do the hard work

    return {name, marker};
};

const GameControl = () => {
    // starts by creating the players
    const player1 = createPlayer("player1" , "X");
    const player2 = createPlayer("player2" , "O");

    let activePlayer = player1;

    const switchActivePlayer = () =>{
        activePlayer = (activePlayer === player1)? player2 : player1;
    }

    const playATurn = (row, column) => { 
        console.log(`It's your turn ${activePlayer.name}`); 

        GameBoard.markACell(row, column,activePlayer.marker);     
        console.log(GameBoard.getGameBoard());

        switchActivePlayer();
    }

    return {playATurn};
};
game = GameControl();
game.playATurn(2,2)
game.playATurn(2,1)
game.playATurn(1,1)