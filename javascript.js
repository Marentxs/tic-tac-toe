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

const display = (() => {
  const container = document.getElementById("gameboard");
  const rows = 3;
  const columns = 3;
  const cells = [];

  const create = () => {
    const square = document.createElement("div");
    square.classList.add("cell");
    return square;
  };

  function render() {
    container.innerHTML = "";
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const square = create();
        container.appendChild(square);

        if (!cells[i]) cells[i] = [];
        cells[i][j] = square;

        square.dataset.row = i;
        square.dataset.col = j;
      }
    }
    return container;
  }

  function getCell(row, col) {
    return cells[row][col];
  }

  return { render, getCell };
})();

const flow = (function () {
  const board = gameboard;
  const container = display.render();
  const announce = document.querySelector(".announce");

  const players = [
    { name: "player 1", token: "X" },
    { name: "player 2", token: "O" },
  ];
  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  function updateScreen() {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const val = board.getBoard()[r][c].getValue();
        if (val === 0) continue;

        const cell = display.getCell(r, c);
        cell.textContent = val;
      }
    }
  }

  container.addEventListener("click", function (event) {
    const r = Number(event.target.dataset.row);
    const c = Number(event.target.dataset.col);

    if (isNaN(r) || isNaN(c)) return;

    playRound(r, c);
  });

  const playRound = (row, column) => {
    if (isGameOver()) return;

    console.log(
      `Playing ${
        getActivePlayer().name
      }'s token into row ${row} column ${column}...`
    );

    if (activePlayer === players[0]) {
      board.selectCell(row, column, activePlayer.token);
      updateScreen();

      const result = getGameResult();
      if (result.status === "win") {
        announce.textContent = `${result.winner} Wins!`;
        return;
      } else if (result.status === "draw") {
        announce.textContent = "It's a Draw!";
        return;
      }

      activePlayer = players[1];
      printNewRound();
    } else {
      board.selectCell(row, column, activePlayer.token);
      updateScreen();

      const result = getGameResult();
      if (result.status === "win") {
        announce.textContent = `${result.winner} Wins!`;
        return;
      } else if (result.status === "draw") {
        announce.textContent = "It's a Draw!";
        return;
      }

      activePlayer = players[0];
      printNewRound();
    }
  };

  const isGameOver = () => {
    const boardData = board.getBoard();

    if (checkWinner().winner !== 0) return true;

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
        return {
          winner: boardData[row][0].getValue(),
          line: "row",
          index: row,
        };
      }
    }
    for (let col = 0; col < 3; col++) {
      if (
        boardData[0][col].getValue() !== 0 &&
        boardData[0][col].getValue() === boardData[1][col].getValue() &&
        boardData[1][col].getValue() === boardData[2][col].getValue()
      ) {
        return {
          winner: boardData[0][col].getValue(),
          line: "col",
          index: col,
        };
      }
    }
    if (
      boardData[0][0].getValue() !== 0 &&
      boardData[0][0].getValue() === boardData[1][1].getValue() &&
      boardData[1][1].getValue() === boardData[2][2].getValue()
    ) {
      return { winner: boardData[0][0].getValue(), line: "diag", index: 0 };
    }
    if (
      boardData[2][0].getValue() !== 0 &&
      boardData[2][0].getValue() === boardData[1][1].getValue() &&
      boardData[1][1].getValue() === boardData[0][2].getValue()
    ) {
      return { winner: boardData[2][0].getValue(), line: "diag", index: 1 };
    }

    return { winner: 0 };
  };

  function getGameResult() {
    const winReport = checkWinner();
    if (winReport.winner !== 0) {
      return { status: "win", winner: winReport.winner, lineInfo: winReport };
    }

    const boardData = board.getBoard();
    const full = boardData.every((row) =>
      row.every((cell) => cell.getValue() !== 0)
    );
    if (full) return { status: "draw" };

    return { status: "ongoing" };
  }

  return {
    getActivePlayer,
    printNewRound,
    playRound,
    checkWinner,
    isGameOver,
    getGameResult,
  };
})();
