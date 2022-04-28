"use-strict";

class TokenBoard {
  canvas;

  context;

  constructor(boardContainer, size) {
    this.boardContainer = boardContainer;
    this.boardSize = size;
    this.init();
  }

  setCanvas() {
    if (!document.getElementById("token-board")) {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("id", "token-board");
      document.getElementById("game-container").appendChild(canvas);
    }
    this.canvas = document.getElementById("token-board");
    this.canvas.width = this.boardSize;
    this.canvas.height = this.boardSize;
    this.context = this.canvas.getContext("2d");
  }

  draw(x, y, radius, fillStyle) {
    const circle = new Path2D();
    circle.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = fillStyle;
    this.context.beginPath();
    this.context.fill(circle);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  init() {
    this.setCanvas();
  }
}

export default TokenBoard;
