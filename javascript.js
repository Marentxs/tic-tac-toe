const gameboard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];

    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }

  const getBoard = () => board;

  function selectCell(row, column, player) {
    if (board[row][column].getValue() !== 0) {
      console.log("spot Taken!");
      return;
    }
    board[row][column].addToken(player);
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, selectCell, printBoard };
})();

const cell = function () {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
};

const flow = (function () {
  const board = gameboard;
  const players = [
    { name: "player1", token: 1 },
    { name: "player2", token: 2 },
  ];
  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (row, column) => {
    if (board.isGameOver()) return;

    console.log(
      `Playing ${
        getActivePlayer().name
      }'s token into row ${row} column ${column}...`
    );

    if (activePlayer === players[0]) {
      board.selectCell(row, column, activePlayer.token);
      activePlayer = players[1];
      printNewRound();
    } else {
      board.selectCell(row, column, activePlayer.token);
      activePlayer = players[0];
      printNewRound();
    }
  };

  const isGameOver = () => {
    const boardData = board.getBoard();

    if (checkWinner() !== 0) return true;

    if (boardData.every((row) => row.every((cell) => cell.getValue() !== 0))) {
      return true;
    } else {
      return false;
    }
  };

  const checkWinner = () => {
    const boardData = board.getBoard();

    for (let row = 0; row < 3; row++) {
      if (
        boardData[row][0].getValue() !== 0 &&
        boardData[row][0].getValue() === boardData[row][1].getValue() &&
        boardData[row][1].getValue() === boardData[row][2].getValue()
      ) {
        return boardData[row][0].getValue();
      }
    }
    for (let col = 0; col < 3; col++) {
      if (
        boardData[0][col].getValue() !== 0 &&
        boardData[0][col].getValue() === boardData[1][col].getValue() &&
        boardData[1][col].getValue() === boardData[2][col].getValue()
      ) {
        return boardData[0][col].getValue();
      }
    }
    if (
      boardData[0][0].getValue() !== 0 &&
      boardData[0][0].getValue() === boardData[1][1].getValue() &&
      boardData[1][1].getValue() === boardData[2][2].getValue()
    ) {
      return boardData[0][0].getValue();
    }
    if (
      boardData[2][0].getValue() !== 0 &&
      boardData[2][0].getValue() === boardData[1][1].getValue() &&
      boardData[1][1].getValue() === boardData[0][2].getValue()
    ) {
      return boardData[2][0].getValue();
    }

    return 0;
  };

  return { getActivePlayer, printNewRound, playRound, checkWinner, isGameOver };
})();
