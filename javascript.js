const cell = function () {
  let value = 0;

  const addToken = (player) => (value = player);
  const getValue = () => value;
  const reset = () => (value = 0);

  return { addToken, getValue, reset };
};

const gameboard = (function () {
  const rows = 3;
  const cols = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(cell());
    }
  }

  const getBoard = () => {
    return board.map((row) => row.map((cell) => cell.getValue()));
  };
  const selectCell = (row, col, player) => {
    if (row >= rows || row < 0 || col < 0 || col >= cols) {
      console.log("Incorrect coordinates");
      return false;
    }
    if (board[row][col].getValue() !== 0) {
      console.log("Spot taken");
      return false;
    }
    board[row][col].addToken(player);
    return true;
  };
  const printBoard = () => {
    console.log(getBoard());
  };

  const checkWin = (row, col) => {
    if (
      board[row][0].getValue() !== 0 &&
      board[row][0].getValue() === board[row][1].getValue() &&
      board[row][1].getValue() === board[row][2].getValue()
    ) {
      return true;
    } else if (
      board[0][col].getValue() !== 0 &&
      board[0][col].getValue() === board[1][col].getValue() &&
      board[1][col].getValue() === board[2][col].getValue()
    ) {
      return true;
    } else if (
      board[0][0].getValue() !== 0 &&
      board[0][0].getValue() === board[1][1].getValue() &&
      board[1][1].getValue() === board[2][2].getValue()
    ) {
      return true;
    } else if (
      board[0][2].getValue() !== 0 &&
      board[0][2].getValue() === board[1][1].getValue() &&
      board[1][1].getValue() === board[2][0].getValue()
    ) {
      return true;
    } else {
      return false;
    }
  };
  const checkTie = (row, col) => {
    if (checkWin(row, col)) {
      return false;
    }
    return board.every((row) => row.every((cell) => cell.getValue() !== 0));
  };

  const checkOver = (row, col) => {
    if (checkWin(row, col) || checkTie(row, col)) {
      return true;
    } else {
      return false;
    }
  };

  const players = [
    { name: "playerOne", token: "X" },
    { name: "playerTwo", token: "O" },
  ];
  const getActivePlayer = () => activePlayer;
  let activePlayer = players[0];
  let gameActive = true;
  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const playRound = (row, col) => {
    if (!gameActive) {
      console.log("Game's already over");
      return;
    }

    const moveSucess = selectCell(row, col, activePlayer.token);
    if (moveSucess) {
      if (checkOver(row, col)) {
        gameActive = false;
        console.log("Game ended!");
      } else {
        switchPlayer();
      }
      printBoard();
    }
  };
  printBoard();

  const resetGame = () => {
    gameActive = true;
    activePlayer = players[0];

    board.forEach((row) => {
      row.forEach((cell) => {
        cell.reset();
      });
    });
  };

  const getGameResult = () => {
    if (checkWin(row, col)) {
      return board[row][col].getValue();
    }
    if (checkTie === true) {
      return "tie";
    }
    if (checkWin === false && checkTie === false) {
      return "ongoing";
    }
  };

  return {
    getBoard,
    selectCell,
    printBoard,
    checkOver,
    playRound,
    getActivePlayer,
    resetGame,
    getGameResult,
  };
})();
