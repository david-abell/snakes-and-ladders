"use-strict";

// import { getSlope } from "./helpers.js";
// Inputs: player number
// Variables: player color, player position

class PlayerToken {
  token = new Path2D();

  oldPosition = 0;

  newPosition;

  gridReference;

  constructor(playerNumber, context) {
    this.playerNumber = playerNumber;
    this.playerColor = this.setPlayerColor();
    this.context = context;
  }

  setGrid(grid) {
    this.gridReference = grid;
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

  setNewPosition(position) {
    this.newPosition = position;
  }

  clear(x, y) {
    const clearX = x - 15;
    const clearY = y - 15;
    this.context.clearRect(clearX, clearY, 30, 30);
  }

  draw(x, y) {
    const circle = new Path2D();
    circle.arc(x, y, 15, 0, 2 * Math.PI);
    this.context.beginPath();
    this.context.fillStyle = this.playerColor;
    this.context.fill(circle);
  }

  update() {
    this.oldPosition += 1;
  }

  // updatePortal() {
  //   const slope = getSlope(
  //     ...this.gridReference[this.oldPosition],
  //     ...this.gridReference[this.newPosition]
  //   );
  //   console.log(...this.gridReference[this.oldPosition]);
  //   console.log(...this.gridReference[this.newPosition]);
  //   console.log("slope", slope);
  //   // new point = slope of start, end
  //   // return new point as start
  // }

  animatePortal(oldToken) {
    const nextX = this.gridReference[this.oldPosition][0];
    const nextY = this.gridReference[this.oldPosition][1];

    if (oldToken) {
      this.clear(oldToken[0], oldToken[1]);
    } else {
      this.clear(nextX, nextY);
    }
    this.draw(nextX, nextY);
    // this.updatePortal();
    // this.oldPosition = this.newPosition;

    window.requestAnimationFrame(() => this.animatePortal([nextX, nextY]));
  }

  animationLoop(oldToken) {
    const nextX = this.gridReference[this.oldPosition][0];
    const nextY = this.gridReference[this.oldPosition][1];

    if (oldToken) {
      this.clear(oldToken[0], oldToken[1]);
    } else {
      this.clear(nextX, nextY);
    }
    this.draw(nextX, nextY);
    this.update();
    if (this.oldPosition > this.newPosition) {
      // console.log("old, new positions:", this.oldPosition, this.newPosition);
      this.oldPosition = this.newPosition;
      return;
    }
    window.requestAnimationFrame(() => this.animationLoop([nextX, nextY]));
  }

  // @param position Number 1-100
  // @param isPortal Boolean

  animate(position, isPortal, callback) {
    this.setNewPosition(position - 1);
    if (isPortal) {
      this.animatePortal();
    } else {
      this.animationLoop();
    }
    if (callback) {
      callback();
    }
  }
}
export default PlayerToken;
