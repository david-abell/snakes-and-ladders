"use-strict";

if (!document.querySelector("#game-tokens")) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "game-tokens");
  document.body.append(canvas);
}

const tokenBoard = document.querySelector("#game-tokens");
// eslint-disable-next-line no-unused-vars
const context = tokenBoard.getContext("2d");

function initTokens(inputSize) {
  const isInputInteger = Number.isInteger(inputSize);
  const requestedSize = isInputInteger ? Math.max(inputSize, 250) : 250;
  const maxBoardSize = Math.min(window.innerHeight, window.innerWidth);
  const boardSize = requestedSize < maxBoardSize ? requestedSize : maxBoardSize;

  tokenBoard.width = boardSize;
  tokenBoard.height = boardSize;
}

export default initTokens;
