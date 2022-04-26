"use-strict";

import getRandomDie from "./helpers.js";
import { snakes, ladders, initBoard, game } from "./board.js";
import PlayerToken from "./PlayerToken.js";
import { initTokens, tokenContext } from "./TokenBoard.js";

// Update players to object?
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

  gridReferenc;

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

  // This was a pain in the butt getting the calculations right
  calcCoordinates(player) {
    const { width } = game;
    const { height } = game;
    const gridCount = width / 10;
    const centerOffset = gridCount / 2;
    // @Position minus 1 because the row calculations only work 0-9, not 1-10
    const position = this.players[player].position - 1;
    const isEvenRow = Math.floor(position / 10) % 2 !== 0;
    const yOffset = Math.floor(position / 10) * gridCount;
    const xOffset = (position - Math.floor(position / 10) * 10) * gridCount;
    let coordinateX = centerOffset + xOffset;

    if (isEvenRow) {
      coordinateX = width - (centerOffset + xOffset);
    }

    const coordinateY = height - (gridCount / 2 + yOffset);

    return { coordinateX, coordinateY };
  }

  setPlayerCoordinates(player, coordinates) {
    this.players[player].coordinateX = coordinates.coordinateX;
    // this.players[player].token.newTokenX = coordinates.coordinateX;
    this.players[player].coordinateY = coordinates.coordinateY;
    // this.players[player].token.newTokenY = coordinates.coordinateY;
    this.players[player].token.setNewXY(
      coordinates.coordinateX,
      coordinates.coordinateY
    );
  }

  // eslint-disable-next-line class-methods-use-this
  move(playerPosition) {
    const bouncedPosition =
      playerPosition > 100 ? 100 - (playerPosition - 100) : playerPosition;
    if (snakes[bouncedPosition]) {
      return snakes[bouncedPosition] + bouncedPosition;
    }
    if (ladders[bouncedPosition]) {
      return ladders[bouncedPosition] + bouncedPosition;
    }
    return bouncedPosition;
  }

  movePlayerToken() {
    const tokenPosition = this.calcCoordinates(this.currentPlayer);
    this.setPlayerCoordinates(this.currentPlayer, tokenPosition);
    // const drawX = this.players[this.currentPlayer].coordinateX;
    // const drawY = this.players[this.currentPlayer].coordinateY;
    // this.players[this.currentPlayer].token.draw(drawX, drawY);
    this.players[this.currentPlayer].token.animationLoop();
  }

  clearPlayerToken() {
    const clearX = this.players[this.currentPlayer].coordinateX;
    const clearY = this.players[this.currentPlayer].coordinateY;
    this.players[this.currentPlayer].token.clear(clearX, clearY);
  }

  play() {
    if (this.victory) {
      this.message = `Game over! Player ${this.currentPlayer} has won!`;
      return;
    }

    this.turnDice = this.rollDice();
    this.isDoubles = this.checkDoubles();
    this.diceTotal = this.rollTotal();

    const newMove =
      this.currentPlayer === 1
        ? this.move(this.players[1].position + this.diceTotal)
        : this.move(this.players[2].position + this.diceTotal);

    // this.clearPlayerToken();
    this.players[this.currentPlayer].position = newMove;
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
