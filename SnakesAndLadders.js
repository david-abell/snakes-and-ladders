const getRandomDie = require("./helpers.js");

class SnakesAndLadders {
  player1 = 0;
  player2 = 0;
  currentPlayer = 1;
  turnDice = { die1: null, die2: null };
  diceTotal = null;
  isDoubles = false;

  constructor() {}

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

  samePlayerTurn() {
    return this.currentPlayer === 1
      ? `Player 1 is on square ${this.player1}`
      : `Player 2 is on square ${this.player2}`;
  }

  nextPlayerTurn() {
    return this.currentPlayer === 1
      ? `Player 2 is on square ${this.player2}`
      : `Player 1 is on square ${this.player1}`;
  }

  isWon() {
    if (this.player1 === 100 || this.player2 === 100) {
      return true;
    }
    return false;
  }

  play() {
    if (this.isWon()) {
      return "Game over!";
    }

    this.turnDice = this.rollDice();
    this.isDoubles = this.checkDoubles();
    this.diceTotal = this.rollTotal();

    const newMove =
      this.currentPlayer === 1
        ? this.move(this.player1 + this.diceTotal)
        : this.move(this.player2 + this.diceTotal);

    if (this.currentPlayer === 1) {
      this.player1 = newMove;
    } else {
      this.player2 = newMove;
    }

    if (newMove === 100) {
      return `Player ${this.currentPlayer} Wins!`;
    }

    if (this.isDoubles) {
      return this.samePlayerTurn();
    }

    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    return this.nextPlayerTurn();
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
