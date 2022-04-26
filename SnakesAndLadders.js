"use-strict";

import getRandomDie from "./helpers.js";
import { snakes, ladders, initBoard } from "./board.js";
import PlayerToken from "./PlayerToken.js";
import { initTokens, tokenContext } from "./TokenBoard.js";

class SnakesAndLadders {
  victory = false;

  currentPlayer = 1;

  players = {
    1: {
      position: 0,
      coordinateX: 0,
      coordinateY: 0,
      token: new PlayerToken(1, tokenContext),
    },
    2: {
      position: 0,
      coordinateX: 0,
      coordinateY: 0,
      token: new PlayerToken(2, tokenContext),
    },
  };

  turnDice = { die1: null, die2: null };

  diceTotal = null;

  isDoubles = false;

  message = "";

  gridReference;

  constructor(boardSize = 800) {
    this.boardSize = boardSize;
  }

  // eslint-disable-next-line class-methods-use-this
  rollDice() {
    const die1 = getRandomDie();
    const die2 = getRandomDie();
    return { die1, die2 };
  }

  checkDoubles() {
    return this.turnDice.die1 === this.turnDice.die2;
  }

  rollTotal() {
    return this.turnDice.die1 + this.turnDice.die2;
  }

  setCurrentPlayer() {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  samePlayerTurn() {
    this.message =
      this.currentPlayer === 1
        ? `Player 1 is on square ${this.players[1].position}`
        : `Player 2 is on square ${this.players[2].position}`;
  }

  nextPlayerTurn() {
    this.message =
      this.currentPlayer === 1
        ? `Player 2 is on square ${this.players[2].position}`
        : `Player 1 is on square ${this.players[1].position}`;
  }

  isWon() {
    if (this.players[1].position === 100 || this.players[2].position === 100) {
      return true;
    }
    return false;
  }

  // This was a pain in the butt getting the calculations right... and then I refactored it out

  // calcCoordinates(player) {
  //   const { width } = game;
  //   const { height } = game;
  //   const gridCount = width / 10;
  //   const centerOffset = gridCount / 2;
  //   // @Position minus 1 because the row calculations only work 0-9, not 1-10
  //   const position = this.players[player].position - 1;
  //   const isEvenRow = Math.floor(position / 10) % 2 !== 0;
  //   const yOffset = Math.floor(position / 10) * gridCount;
  //   const xOffset = (position - Math.floor(position / 10) * 10) * gridCount;
  //   let coordinateX = centerOffset + xOffset;

  //   if (isEvenRow) {
  //     coordinateX = width - (centerOffset + xOffset);
  //   }

  //   const coordinateY = height - (gridCount / 2 + yOffset);

  //   return { coordinateX, coordinateY };
  // }

  // setPlayerCoordinates(player, coordinates) {
  //   this.players[player].coordinateX = coordinates.coordinateX;
  //   // this.players[player].token.newTokenX = coordinates.coordinateX;
  //   this.players[player].coordinateY = coordinates.coordinateY;
  //   // this.players[player].token.newTokenY = coordinates.coordinateY;
  //   this.players[player].token.setNewXY(
  //     coordinates.coordinateX,
  //     coordinates.coordinateY
  //   );
  // }

  setPlayerPosition() {
    const playerPosition =
      this.players[this.currentPlayer].position + this.diceTotal;

    const bouncedPosition =
      playerPosition > 100 ? 100 - (playerPosition - 100) : playerPosition;

    if (snakes[bouncedPosition]) {
      this.players[this.currentPlayer].position =
        snakes[bouncedPosition] + bouncedPosition;
      return;
    }
    if (ladders[bouncedPosition]) {
      this.players[this.currentPlayer].position =
        ladders[bouncedPosition] + bouncedPosition;
      return;
    }
    this.players[this.currentPlayer].position = bouncedPosition;
  }

  getPlayerCoordinates(player) {
    return this.gridReference[player.position - 1] || this.gridReference[0];
  }

  clearPlayerToken() {
    const tokenPosition = this.getPlayerCoordinates(
      this.players[this.currentPlayer]
    );
    const clearX = tokenPosition[0];
    const clearY = tokenPosition[1];
    this.players[this.currentPlayer].token.clear(clearX, clearY);
  }

  movePlayerToken() {
    const player = this.players[this.currentPlayer];
    let drawX = this.getPlayerCoordinates(player)[0];
    let drawY = this.getPlayerCoordinates(player)[1];
    this.players[this.currentPlayer].token.draw(drawX, drawY);

    this.players[this.currentPlayer].token.setNewXY(drawX, drawY);
    // this.players[this.currentPlayer].token.animationLoop();

    // Redraw second player
    const secondPlayer = this.currentPlayer === 1 ? 2 : 1;

    // eslint-disable-next-line prefer-destructuring
    drawX = this.getPlayerCoordinates(this.players[secondPlayer])[0];
    // eslint-disable-next-line prefer-destructuring
    drawY = this.getPlayerCoordinates(this.players[secondPlayer])[1];
    this.players[secondPlayer].token.draw(drawX, drawY);
  }

  play() {
    if (this.victory) {
      this.message = `Game over! Player ${this.currentPlayer} has won!`;
      return;
    }

    this.turnDice = this.rollDice();
    this.isDoubles = this.checkDoubles();
    this.diceTotal = this.rollTotal();
    this.clearPlayerToken();
    this.setPlayerPosition();
    this.movePlayerToken();
    this.victory = this.isWon();

    if (this.victory) {
      this.message = `Player ${this.currentPlayer} Wins!`;
      return;
    }

    if (this.isDoubles) {
      this.samePlayerTurn();
      return;
    }
    this.setCurrentPlayer();
    this.nextPlayerTurn();
  }

  init() {
    this.gridReference = initBoard(this.boardSize);
    initTokens(this.boardSize);
  }
}

export default SnakesAndLadders;
