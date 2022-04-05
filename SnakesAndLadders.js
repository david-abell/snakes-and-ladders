const getRandomDie = require("./helpers.js");

class SnakesAndLadders {
  player1 = 0;
  player2 = 0;
  constructor() {
    this.currentPlayer = 1;
  }

  play(die1, die2) {
    if (this.player1 === 100 || this.player2 === 100) {
      return "Game over!";
    }
    const newRollTotal = this.rollTotal(die1, die2);
    const doubles = die1 === die2;
    const newMove =
      this.currentPlayer === 1
        ? this.move(this.player1 + newRollTotal)
        : this.move(this.player2 + newRollTotal);
    if (this.currentPlayer === 1) {
      this.player1 = newMove;
    } else {
      this.player2 = newMove;
    }
    if (newMove === 100) {
      return `Player ${this.currentPlayer} Wins!`;
    }
    if (doubles) {
      return this.currentPlayer === 1
        ? `Player 1 is on square ${this.player1}`
        : `Player 2 is on square ${this.player2}`;
    }
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    return this.currentPlayer === 1
      ? `Player 2 is on square ${this.player2}`
      : `Player 1 is on square ${this.player1}`;
  }

  rollDice() {
    const die1 = getRandomDie();
    const die2 = getRandomDie();
    return { die1, die2 };
  }

  rollTotal(die1, die2) {
    return die1 + die2;
  }

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
}

const snakes = {
  16: -10,
  46: -21,
  49: -38,
  62: -43,
  64: -4,
  74: -21,
  89: -21,
  92: -4,
  95: -20,
  99: -19,
};

const ladders = {
  2: 36,
  7: 7,
  8: 23,
  15: 11,
  21: 21,
  28: 56,
  36: 8,
  51: 16,
  71: 20,
  78: 20,
  87: 7,
};

module.exports = SnakesAndLadders;
