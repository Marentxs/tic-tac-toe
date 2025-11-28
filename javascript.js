const cell = function () {
  let value = "";

  const addToken = (player) => (value = player);
  const getValue = () => value;
  const reset = () => (value = "");

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
    if (board[row][col].getValue() !== "") {
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
      val !== "" &&
      val === board[row][0].getValue() &&
      val === board[row][1].getValue() &&
      val === board[row][2].getValue()
    )
      return true;

    if (
      val !== "" &&
      val === board[0][col].getValue() &&
      val === board[1][col].getValue() &&
      val === board[2][col].getValue()
    )
      return true;

    if (
      row === col &&
      val !== "" &&
      val === board[0][0].getValue() &&
      val === board[1][1].getValue() &&
      val === board[2][2].getValue()
    )
      return true;

    if (
      row + col === 2 &&
      val !== "" &&
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
    return board.every((row) => row.every((cell) => cell.getValue() !== ""));
  };

  const players = [
    { name: "Player One", token: "X" },
    { name: "Player Two", token: "O" },
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
    display.showMessage();
  };

  const resetGame = () => {
    gameActive = true;
    activePlayer = players[0];

    board.forEach((row) => {
      row.forEach((cell) => {
        cell.reset();
      });
    });
    winner = null;
    display.render();
    display.showMessage();
  };

  const getGameResult = () => {
    if (winner) return winner;
    if (board.flat().every((c) => c.getValue() !== "")) return "tie";
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
  const message = document.querySelector(".message");
  const reset = document.querySelector(".reset");
  const names = document.querySelector(".names");

  const render = () => {
    boardDisplay.innerHTML = "";
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cell = document.createElement("button");
        cell.setAttribute("id", "cell");
        cell.dataset.row = r;
        cell.dataset.col = c;

        const value = gameboard.getBoard()[r][c];
        cell.textContent = value;
        boardDisplay.appendChild(cell);
      }
    }
  };

  const clickHandler = () => {
    boardDisplay.onclick = (e) => {
      if (e.target.tagName !== "BUTTON") return;
      const r = +e.target.dataset.row;
      const c = +e.target.dataset.col;
      gameboard.playRound(r, c);
      render();
    };
  };

  const showMessage = () => {
    const result = gameboard.getGameResult();
    if (result === "X") {
      message.textContent = "Player One wins (X)";
    } else if (result === "O") {
      message.textContent = "Player Two wins (O)";
    } else if (result === "tie") {
      message.textContent = "It's a tie!";
    } else if (result === "ongoing") {
      message.textContent = `${gameboard.getActivePlayer().name}'s turn`;
    } else {
      message.textContent = "Make the first move";
    }
  };

  const newGame = () => {
    reset.onclick = (e) => {
      gameboard.resetGame();
    };
  };

  clickHandler();
  newGame();

  const popup = document.getElementById("popup");

  document.querySelector(".names").onclick = function () {
    popup.classList.add("open");
  };
  document.querySelector(".close").onclick = function (e) {
    e.preventDefault();
    popup.classList.remove("open");
  };
  document.getElementById("playersForm").onsubmit = function (e) {
    e.preventDefault();
    popup.classList.remove("open");
  };

  names.addEventListener("click", () => {});

  return { render, showMessage };
})();

display.render();
