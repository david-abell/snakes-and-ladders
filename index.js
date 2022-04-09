"use-strict";

let game;
let context;

function drawGrid(board) {
  const { width } = board;
  const { height } = board;
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
  for (let i = 0; i < 100; i += 1) {
    const isEvenRow = Math.floor(i / 10) % 2 === 0;
    // ||
    const yOffset = Math.floor(i / 10) * gridCount;
    let squareXStart = gridCount / 2 + gridCount * i - yOffset * 10;
    console.log(isEvenRow, squareXStart);
    if (!isEvenRow) {
      squareXStart = width - (gridCount / 2 + gridCount * i - yOffset * 10);
    }

    const squareYStart = gridCount / 2 + yOffset;
    context.font = "30px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(`${i + 1}`, squareXStart, squareYStart);
  }
}

function init(boardSize) {
  game = document.querySelector("#game");
  game.width = boardSize;
  game.height = boardSize;
  context = game.getContext("2d");
  drawGrid(game);
}

window.onload = init(800);
