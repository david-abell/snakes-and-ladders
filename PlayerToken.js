"use-strict";

// Inputs: player number
// Variables: player color, player position

class PlayerToken {
  token = new Path2D();

  constructor(playerNumber) {
    this.playerNumber = playerNumber;
    this.playerColor = this.setPlayerColor();
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

  draw(x, y, context) {
    context.clearRect(x, y, 15, 15);
    context.beginPath();

    const circle = new Path2D();
    circle.arc(x, y, 15, 0, 2 * Math.PI);
    context.fillStyle = this.playerColor;
    context.fill(circle);
  }
}
export default PlayerToken;
