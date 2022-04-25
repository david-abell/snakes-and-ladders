"use-strict";

// Inputs: player number
// Variables: player color, player position

class PlayerToken {
  token = new Path2D();

  tokenX = 0;

  tokenY = 0;

  constructor(playerNumber, context) {
    this.playerNumber = playerNumber;
    this.playerColor = this.setPlayerColor();
    this.context = context;
  }

  setPlayerColor() {
    const player = this.playerNumber;
    const colors = {
      1: "red",
      2: "blue",
    };
    const selectedColor = colors[player];
    return selectedColor;
  }

  clear(x, y) {
    const clearX = x - 15;
    const clearY = y - 15;
    this.context.clearRect(clearX, clearY, 30, 30);
  }

  draw(x, y) {
    this.context.beginPath();

    const circle = new Path2D();
    circle.arc(x, y, 15, 0, 2 * Math.PI);
    this.context.fillStyle = this.playerColor;
    this.context.fill(circle);
  }

  update() {
    this.tokenY += 1;
    this.tokenX += 1;
  }

  animationLoop(context) {
    this.clear(this.tokenX, this.tokenY, context);
  }
}
export default PlayerToken;
