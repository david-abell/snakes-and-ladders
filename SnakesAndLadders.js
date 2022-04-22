"use-strict";

import getRandomDie from "./helpers.js";
import { snakes, ladders, initBoard, game, context } from "./board.js";
import PlayerToken from "./PlayerToken.js";
import initTokens from "./TokenBoard.js";

// Update players to object?
class SnakesAndLadders {
  victory = false;

  currentPlayer = 1;

  players = {
    1: {
      position: 0,
      coordinateX: 0,
      coordinateY: 0,
      token: new PlayerToken(1),
    },
    2: {
      position: 0,
      coordinateX: 0,
      coordinateY: 0,
      token: new PlayerToken(2),
    },
  };

  turnDice = { die1: null, die2: null };

  diceTotal = null;

  isDoubles = false;

  message = "";

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

  // this has errors, goes negative at win condition
  calcCoordinates(player) {
    const { width } = game;
    const { height } = game;
    const gridCount = width / 10;
    const { position } = this.players[player];
    const isEvenRow = Math.floor(position / 10) % 2 === 0;
    const yOffset = Math.floor(position / 10) * gridCount;
    let coordinateX = gridCount / 2 + gridCount * (position - 1) - yOffset * 10;

    if (!isEvenRow) {
      coordinateX =
        width - (gridCount / 2 + gridCount * (position - 1) - yOffset * 10);
    }

    const coordinateY = height - (gridCount / 2 + yOffset);

    return { coordinateX, coordinateY };
  }

  setPlayerCoordinates(player, coordinateObject) {
    this.players[player].coordinateX = coordinateObject.coordinateX;
    this.players[player].coordinateY = coordinateObject.coordinateY;
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
    const drawX = this.players[this.currentPlayer].coordinateX;
    const drawY = this.players[this.currentPlayer].coordinateY;
    this.players[this.currentPlayer].token.draw(drawX, drawY, context);
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
    initBoard(this.boardSize);
    initTokens(this.boardSize);
  }
}

export default SnakesAndLadders;
