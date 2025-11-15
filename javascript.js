const gameboard = (function () {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
})();

const flow = (function () {
  if (gameOver) {
    return;
  }

  if ((currentPlayer = player1)) {
    board[i].push("X");
    currentPlayer = player2;
  } else if ((currentPlayer = player2)) {
    board[i].push("O");
    currentPlayer = player1;
  }
})();
