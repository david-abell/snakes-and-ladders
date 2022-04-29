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
      1: "#FE7E6D",
      2: "#51AEDC",
    };
    const selectedColor = colors[player];
    return selectedColor;
  }
}
export default PlayerToken;
