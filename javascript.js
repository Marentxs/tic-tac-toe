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
    { name: player1, token: 1 },
    { name: player2, token: 2 },
  ];
  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (column) => {
    if (board.isGameOver()) return;

    console.log(
      `Playing ${getActivePlayer().name}'s token into column ${column}...`
    );

    if (activePlayer === players[0]) {
      board.addToken(column, 1);
      activePlayer = players[1];
    } else {
      board.addToken(column, 2);
      activePlayer = players[0];
    }
  };

  const checkWinner = () => {
    const board = getBoard();

    for (let row = 0; row < 3; row++) {
      if (
        board[row][0].getValue() !== "" &&
        board[row][0].getValue() === board[row][1].getValue() &&
        board[row][1].getValue() === board[row][2].getValue()
      ) {
        return board[row][0].getValue();
      }
    }
    for (let col = 0; col < 3; col++) {
      if (
        board[0][col].getValue() !== "" &&
        board[0][col].getValue() === board[1][col].getValue() &&
        board[1][col].getValue() === board[2][col].getValue()
      ) {
        return board[0][col].getValue();
      }
    }
    for (let row = 0; row < 3; row++) {
      if (
        board[0][0].getValue() !== "" &&
        board[0][0].getValue() === board[1][1].getValue() &&
        board[1][1].getValue() === board[2][2].getValue()
      ) {
        return board[0][0].getValue();
      }
    }
    for (let row = 0; row < 3; row++) {
      if (
        board[2][0].getValue() !== "" &&
        board[2][0].getValue() === board[1][1].getValue() &&
        board[1][1].getValue() === board[0][2].getValue()
      ) {
        return board[2][0].getValue();
      }
    }
    return 0;
  };

  return { getActivePlayer, printNewRound, playRound, checkWinner };
})();
