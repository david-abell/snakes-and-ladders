"use-strict";

let tokenBoard;
// eslint-disable-next-line no-unused-vars
let context;

function initTokens(inputSize) {
  const isInputInteger = Number.isInteger(inputSize);
  const requestedSize = isInputInteger ? Math.max(inputSize, 250) : 250;
  const maxBoardSize = Math.min(window.innerHeight, window.innerWidth);
  const boardSize = requestedSize < maxBoardSize ? requestedSize : maxBoardSize;
  if (!document.querySelector("#game-tokens")) {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "game-tokens");
    document.body.append(canvas);
  }
  tokenBoard = document.querySelector("#game-tokens");
  tokenBoard.width = boardSize;
  tokenBoard.height = boardSize;
  context = tokenBoard.getContext("2d");
}

export default initTokens;
