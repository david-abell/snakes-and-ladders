"use-strict";

class PlayerToken {
  constructor(playerNumber) {
    this.playerNumber = playerNumber;
    this.playerColor = this.setPlayerColor();
    this.radius = 15;
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
}
export default PlayerToken;
