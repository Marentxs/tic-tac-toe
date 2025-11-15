const gameboard = (function () {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const selectCell = (column, player) => {
    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);

    if (!availableCells.length) return;

    board[row][column].selectCell(player);
  };

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

    if (activePlayer === players[0]) {
      board.addToken(column, 1);
      activePlayer = players[1];
    } else {
      board.addToken(column, 2);
      activePlayer = players[0];
    }

    console.log(
      `Playing ${getActivePlayer().name}'s token into column ${column}...`
    );
  };

  return { getActivePlayer, printNewRound, playRound };
})();
