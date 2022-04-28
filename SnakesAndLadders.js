/* eslint-disable prefer-destructuring */

"use-strict";

import { getRandomDie } from "./helpers.js";
import GameBoard from "./GameBoard.js";
import PlayerToken from "./PlayerToken.js";
// import { initTokens, tokenBoard, tokenContext } from "./TokenBoard.js";
import TokenBoard from "./TokenBoard.js";

class SnakesAndLadders {
  tokenBoard;

  gameBoard;

  victory = false;

  currentPlayer = 1;

  otherPlayer = 2;

  players = {
    1: {
      position: 0,
      drawPos: 0,
      token: new PlayerToken(1),
    },
    2: {
      position: 0,
      drawPos: 0,
      token: new PlayerToken(2),
    },
  };

  turnDice = { die1: null, die2: null };

  diceTotal = null;

  isDoubles = false;

  message = "";

  gridReference;

  constructor(containerEl, size = 800) {
    this.boardSize = size;
    this.containerEl = containerEl;
    this.init();
  }

  setBoardSize() {
    const isInputInteger = Number.isInteger(this.boardSize);
    const requestedSize = isInputInteger ? Math.max(this.boardSize, 250) : 250;
    const maxBoardSize = Math.min(window.innerHeight, window.innerWidth);
    const result = requestedSize < maxBoardSize ? requestedSize : maxBoardSize;
    this.boardSize = result;
  }

  setBoardContainer() {
    console.log(this.containerEl);
    if (!this.containerEl) {
      const div = document.createElement("div");
      div.setAttribute("id", "game-container");
      div.classList.add("game-container");
      document.body.appendChild(div);
    }
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
    this.otherPlayer = this.currentPlayer === 1 ? 2 : 1;
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

  // State saves current player number in callback since it updates variable before animation finishes
  animate(state) {
    let player = this.currentPlayer;
    let localOtherPlayer = this.otherPlayer;
    if (state) {
      player = state;
      localOtherPlayer = player === 1 ? 2 : 1;
    }
    const playerXY = this.getGridReferenceXY(player);
    const otherXY = this.getGridReferenceXY(localOtherPlayer);

    this.tokenBoard.clear();
    this.tokenBoard.draw(
      ...otherXY,
      this.players[localOtherPlayer].token.radius,
      this.players[localOtherPlayer].token.playerColor
    );
    this.tokenBoard.draw(
      ...playerXY,
      this.players[player].token.radius,
      this.players[player].token.playerColor
    );
    if (this.players[player].drawPos > this.players[player].position - 1) {
      this.players[player].drawPos = this.players[player].position;
      return;
    }
    this.setDrawPos(player);

    window.requestAnimationFrame(() => this.animate(player));
  }

  setDrawPos(state) {
    let player = this.currentPlayer;
    if (state) {
      player = state;
    }
    this.players[player].drawPos += 1;
  }

  setPlayerPosition() {
    const playerPosition =
      this.players[this.currentPlayer].position + this.diceTotal;

    const bouncedPosition =
      playerPosition > 100 ? 100 - (playerPosition - 100) : playerPosition;

    this.players[this.currentPlayer].position = bouncedPosition;
  }

  checkPortal() {
    // console.log("checking portal:", this.players[this.currentPlayer].position);
    if (this.gameBoard.snakes[this.players[this.currentPlayer].position]) {
      this.players[this.currentPlayer].position +=
        this.gameBoard.snakes[this.players[this.currentPlayer].position];
      this.players[this.currentPlayer].token.animate(
        this.players[this.currentPlayer].position,
        true
      );
      // console.log("portal found:", this.players[this.currentPlayer].position);
    }
    if (this.gameBoard.ladders[this.players[this.currentPlayer].position]) {
      this.players[this.currentPlayer].position +=
        this.gameBoard.ladders[this.players[this.currentPlayer].position];
      this.players[this.currentPlayer].token.animate(
        this.players[this.currentPlayer].position,
        true
      );
      // console.log("portal found:", this.players[this.currentPlayer].position);
    }
  }

  getGridReferenceXY(state) {
    if (state) {
      return (
        this.gridReference[this.players[state].drawPos - 1] ||
        this.gridReference[0]
      );
    }
    return (
      this.gridReference[this.players[this.currentPlayer].drawPos - 1] ||
      this.gridReference[0]
    );
  }

  play() {
    if (this.victory) {
      this.message = `Game over! Player ${this.currentPlayer} has won!`;
      return;
    }

    this.turnDice = this.rollDice();
    this.isDoubles = this.checkDoubles();
    this.diceTotal = this.rollTotal();
    this.setPlayerPosition();
    this.animate();
    // this.checkPortal();
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
    this.setBoardContainer();
    this.setBoardSize();
    this.gameBoard = new GameBoard(this.containerEl, this.boardSize);
    this.tokenBoard = new TokenBoard(this.containerEl, this.boardSize);
    this.gridReference = this.gameBoard.gridReference;
    this.players[1].token.x = this.gridReference[0][0];
    this.players[1].token.y = this.gridReference[0][1];
    this.players[2].token.x = this.gridReference[0][0];
    this.players[2].token.y = this.gridReference[0][1];
  }
}

export default SnakesAndLadders;
