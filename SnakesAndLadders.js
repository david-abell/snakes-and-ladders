/* eslint-disable prefer-destructuring */

"use-strict";

import { getRandomDie, getSlope, getIntercept } from "./helpers.js";
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
    if (!this.containerEl) {
      const newDiv = document.createElement("div");
      newDiv.setAttribute("id", "game-container");
      newDiv.classList.add("game-container");
      this.containerEl = newDiv;
      document.body.appendChild(newDiv);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  rollDice() {
    const die1 = getRandomDie();
    const die2 = getRandomDie();
    return { die1, die2 };
  }

  isDoubles() {
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

  // State saves current player number for correct requestAnimationFrame data
  animate(playerState) {
    let player = this.currentPlayer;
    let otherPlayerState = this.otherPlayer;
    if (playerState) {
      player = playerState;
      otherPlayerState = player === 1 ? 2 : 1;
    }
    const playerXY = this.getDrawPositionGridReference(player);
    const otherXY = this.getDrawPositionGridReference(otherPlayerState);

    this.tokenBoard.clear();
    this.tokenBoard.draw(
      ...otherXY,
      this.players[otherPlayerState].token.radius,
      this.players[otherPlayerState].token.playerColor
    );
    this.tokenBoard.draw(
      ...playerXY,
      this.players[player].token.radius,
      this.players[player].token.playerColor
    );

    if (this.players[player].drawPos > this.players[player].position - 1) {
      this.players[player].drawPos = this.players[player].position;
      this.checkPortal();
      return;
    }
    this.setDrawPos(player);

    window.requestAnimationFrame(() => this.animate(player));
  }

  animatePortal(playerState, xyArr) {
    let player = this.currentPlayer;
    let otherPlayerState = this.otherPlayer;
    if (playerState) {
      player = playerState;
      otherPlayerState = player === 1 ? 2 : 1;
    }
    const playerXY = xyArr || this.getDrawPositionGridReference(player);
    const otherXY = this.getDrawPositionGridReference(otherPlayerState);

    this.tokenBoard.clear();
    this.tokenBoard.draw(
      ...otherXY,
      this.players[otherPlayerState].token.radius,
      this.players[otherPlayerState].token.playerColor
    );
    this.tokenBoard.draw(
      ...playerXY,
      this.players[player].token.radius,
      this.players[player].token.playerColor
    );
    const nextDrawXY = this.getNextDrawPoint(
      playerXY,
      this.getPositionGridReference(player)
    );
    const startPosition = this.getDrawPositionGridReference(player);
    const endPosition = this.getPositionGridReference(player);
    const isDrawXGreaterThanEndX = nextDrawXY[0] >= endPosition[0];
    const isDrawYGreaterThanEndY = nextDrawXY[1] >= endPosition[1];
    const doesPortalGoLeft = startPosition[0] > endPosition[0];
    const isPortalVertical = startPosition[0] === endPosition[0];
    const isLadder = startPosition[1] < endPosition[1];
    if (nextDrawXY[0] === endPosition[0] && nextDrawXY[1] === endPosition[1]) {
      this.setDrawPosToPosition(player);
      this.finishTurn();
      return;
    }
    if (isPortalVertical && isLadder && isDrawYGreaterThanEndY) {
      this.setDrawPosToPosition(player);
      this.finishTurn();
      return;
    }

    if (isPortalVertical && !isLadder && !isDrawYGreaterThanEndY) {
      this.setDrawPosToPosition(player);
      this.finishTurn();
      return;
    }

    if (
      isLadder &&
      doesPortalGoLeft &&
      !isDrawXGreaterThanEndX &&
      isDrawYGreaterThanEndY
    ) {
      this.setDrawPosToPosition(player);
      this.finishTurn();
      return;
    }

    if (
      isLadder &&
      !doesPortalGoLeft &&
      isDrawXGreaterThanEndX &&
      isDrawYGreaterThanEndY
    ) {
      this.setDrawPosToPosition(player);
      this.finishTurn();
      return;
    }

    if (
      !isLadder &&
      doesPortalGoLeft &&
      !isDrawXGreaterThanEndX &&
      !isDrawYGreaterThanEndY
    ) {
      this.setDrawPosToPosition(player);
      this.finishTurn();
      return;
    }

    if (
      !isLadder &&
      !doesPortalGoLeft &&
      isDrawXGreaterThanEndX &&
      !isDrawYGreaterThanEndY
    ) {
      this.setDrawPosToPosition(player);
      this.finishTurn();
      return;
    }
    window.requestAnimationFrame(() => this.animatePortal(player, nextDrawXY));
  }

  setDrawPosToPosition(playerState) {
    let player = this.currentPlayer;
    if (playerState) {
      player = playerState;
    }
    this.players[player].drawPos = this.players[player].position;
  }

  setDrawPos(playerState) {
    let player = this.currentPlayer;
    if (playerState) {
      player = playerState;
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

  // eslint-disable-next-line class-methods-use-this
  getNextDrawPoint(startPoint, endPoint) {
    const [x1, y1] = startPoint;
    const [x2, y2] = endPoint;
    const slope = getSlope(x1, y1, x2, y2);
    let newY;
    const newX = x1 > x2 ? x1 - 5 : x1 + 5;
    const intercept = getIntercept(x1, y1, slope);
    if (Number.isFinite(slope) && slope !== 0) {
      newY = slope * newX + intercept;
    } else {
      newY = y2;
    }
    return [newX, newY];
  }

  getDrawPositionGridReference(playerState) {
    if (playerState) {
      return (
        this.gridReference[this.players[playerState].drawPos - 1] ||
        this.gridReference[0]
      );
    }
    return (
      this.gridReference[this.players[this.currentPlayer].drawPos - 1] ||
      this.gridReference[0]
    );
  }

  getPositionGridReference(playerState) {
    if (playerState) {
      return (
        this.gridReference[this.players[playerState].position - 1] ||
        this.gridReference[0]
      );
    }
    return (
      this.gridReference[this.players[this.currentPlayer].position - 1] ||
      this.gridReference[0]
    );
  }

  checkPortal() {
    const isSnakePortal =
      this.gameBoard.snakes[this.players[this.currentPlayer].position];
    if (isSnakePortal) {
      this.players[this.currentPlayer].position +=
        this.gameBoard.snakes[this.players[this.currentPlayer].position];
      this.animatePortal();
      return;
    }
    const isLadderPortal =
      this.gameBoard.ladders[this.players[this.currentPlayer].position];
    if (isLadderPortal) {
      this.players[this.currentPlayer].position +=
        this.gameBoard.ladders[this.players[this.currentPlayer].position];
      this.animatePortal();
      return;
    }
    this.finishTurn();
  }

  play() {
    if (this.victory) {
      this.message = `Game over! Player ${this.currentPlayer} has won!`;
      return;
    }

    this.turnDice = this.rollDice();
    this.diceTotal = this.rollTotal();
    this.setPlayerPosition();
    this.animate();
  }

  finishTurn() {
    this.victory = this.isWon();

    if (this.victory) {
      this.message = `Player ${this.currentPlayer} Wins!`;
      return;
    }

    if (this.isDoubles()) {
      this.samePlayerTurn();
    } else {
      this.setCurrentPlayer();
      this.nextPlayerTurn();
    }
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
    this.animate();
  }
}

export default SnakesAndLadders;
