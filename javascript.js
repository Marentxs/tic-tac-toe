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
  let lastMove = null;
  let winner = null;

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
    const val = board[row][col].getValue();

    if (
      val !== 0 &&
      val === board[row][0].getValue() &&
      val === board[row][1].getValue() &&
      val === board[row][2].getValue()
    )
      return true;

    if (
      val !== 0 &&
      val === board[0][col].getValue() &&
      val === board[1][col].getValue() &&
      val === board[2][col].getValue()
    )
      return true;

    if (
      row === col &&
      val !== 0 &&
      val === board[0][0].getValue() &&
      val === board[1][1].getValue() &&
      val === board[2][2].getValue()
    )
      return true;

    if (
      row + col === 2 &&
      val !== 0 &&
      val === board[0][2].getValue() &&
      val === board[1][1].getValue() &&
      val === board[2][0].getValue()
    )
      return true;
    return false;
  };

  const checkTie = (row, col) => {
    if (checkWin(row, col)) {
      return false;
    }
    return board.every((row) => row.every((cell) => cell.getValue() !== 0));
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
    lastMove = { row, col };
    if (!moveSucess) return;

    if (checkWin(row, col)) {
      gameActive = false;
      winner = activePlayer.token;
    } else if (checkTie(row, col)) {
      gameActive = false;
      winner = "tie";
    }

    if (gameActive) switchPlayer();
    printBoard();
  };

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
    if (winner) return winner;
    if (board.flat().every((c) => c.getValue() !== 0)) return "tie";
    return "ongoing";
  };

  return {
    getBoard,
    selectCell,
    printBoard,
    playRound,
    getActivePlayer,
    resetGame,
    getGameResult,
  };
})();

const display = (() => {
  const boardDisplay = document.querySelector("#boardDisplay");
  const message = document.querySelector("#message");

  const render = () => {
    boardDisplay.innerHTML = "";
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cell = document.createElement("button");
        cell.dataset.row = r;
        cell.dataset.col = c;
        boardDisplay.appendChild(cell);
      }
    }
  };

  const clickHandler = () => {};

  const showMessage = () => {};

  return { render, clickHandler, showMessage };
})();

display.render();
