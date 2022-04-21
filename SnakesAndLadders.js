"use-strict";

import getRandomDie from "./helpers.js";
import { snakes, ladders, initBoard, game, context } from "./board.js";
import PlayerToken from "./PlayerToken.js";

// Update players to object?
class SnakesAndLadders {
  victory = false;

  player1 = 0;

  player2 = 0;

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
    return this.currentPlayer === 1
      ? `Player 1 is on square ${this.players[1].position}`
      : `Player 2 is on square ${this.players[2].position}`;
  }

  nextPlayerTurn() {
    return this.currentPlayer === 1
      ? `Player 2 is on square ${this.players[2].position}`
      : `Player 1 is on square ${this.players[1].position}`;
  }

  isWon() {
    if (this.players[1].position === 100 || this.players[2].position === 100) {
      return true;
    }
    return false;
  }

  calcCoordinates(player) {
    const { width } = game;
    const { height } = game;
    const gridCount = width / 10;
    const { position } = this.players[player];
    const isEvenRow = Math.floor(position / 10) % 2 === 0;
    const yOffset = Math.floor(position / 10) * gridCount;
    let coordinateX = gridCount / 2 + gridCount * position - yOffset * 10;

    if (!isEvenRow) {
      coordinateX =
        width - (gridCount / 2 + gridCount * position - yOffset * 10);
    }

    const coordinateY = height - (gridCount / 2 + yOffset);

    // context.fillText(`${position + 1}`, coorY, coorY);

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
    this.victory = this.isWon();
    console.log(this.victory);

    if (this.victory) {
      return "Game over!";
    }

    this.turnDice = this.rollDice();
    this.isDoubles = this.checkDoubles();
    this.diceTotal = this.rollTotal();

    const newMove =
      this.currentPlayer === 1
        ? this.move(this.players[1].position + this.diceTotal)
        : this.move(this.players[2].position + this.diceTotal);

    // if (this.currentPlayer === 1) {
    //   this.player1 = newMove;
    // } else {
    //   this.player2 = newMove;
    // }

    this.players[this.currentPlayer].position = newMove;
    this.movePlayerToken();
    if (newMove === 100) {
      return `Player ${this.currentPlayer} Wins!`;
    }

    if (this.isDoubles) {
      return this.samePlayerTurn();
    }
    this.setCurrentPlayer();
    return this.nextPlayerTurn();
  }

  init() {
    initBoard(this.boardSize);
  }
}

export default SnakesAndLadders;
