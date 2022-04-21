"use-strict";

const snakes = {
  16: -10,
  46: -21,
  49: -38,
  62: -43,
  64: -4,
  74: -21,
  89: -21,
  92: -4,
  95: -20,
  99: -19,
};

const ladders = {
  2: 36,
  7: 7,
  8: 23,
  15: 11,
  21: 21,
  28: 56,
  36: 8,
  51: 16,
  71: 20,
  78: 20,
  87: 7,
};

// eslint-disable-next-line import/no-mutable-exports
let game;
// eslint-disable-next-line import/no-mutable-exports
let context;

function drawBoard(boardElement) {
  const { width } = boardElement;
  const { height } = boardElement;
  const gridCount = width / 10;

  context.beginPath();
  context.strokeStyle = "black";
  context.lineWidth = 1;

  for (let x = 0; x <= width; x += gridCount) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }

  for (let y = 0; y <= height; y += gridCount) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
  context.stroke();

  context.font = "30px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";

  for (let i = 0; i < 100; i += 1) {
    const isEvenRow = Math.floor(i / 10) % 2 === 0;
    const yOffset = Math.floor(i / 10) * gridCount;
    let squareXStart = gridCount / 2 + gridCount * i - yOffset * 10;
    if (!isEvenRow) {
      squareXStart = width - (gridCount / 2 + gridCount * i - yOffset * 10);
    }

    const squareYStart = height - (gridCount / 2 + yOffset);

    context.fillText(`${i + 1}`, squareXStart, squareYStart);
  }
}

function initBoard(inputSize) {
  const isInputInteger = Number.isInteger(inputSize);
  const requestedSize = isInputInteger ? Math.max(inputSize, 250) : 250;
  const maxBoardSize = Math.min(window.innerHeight, window.innerWidth);
  const boardSize = requestedSize < maxBoardSize ? requestedSize : maxBoardSize;
  if (!document.querySelector("#game-board")) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "game-board");
    document.body.append(canvas);
  }
  game = document.querySelector("#game-board");
  game.width = boardSize;
  game.height = boardSize;
  context = game.getContext("2d");
  drawBoard(game);
}
export { snakes, ladders, drawBoard, initBoard, game, context };
