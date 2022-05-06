/* eslint-disable prefer-destructuring */

"use-strict";

import { getRandomDie, getSlope, getIntercept } from "./helpers.js";
import GameBoard from "./GameBoard.js";
import PlayerToken from "./PlayerToken.js";
import TokenBoard from "./TokenBoard.js";

class SnakesAndLadders {
  tokenBoard;

  tokenRadius;

  gameBoard;

  victory = false;

  turnTotal = 0;

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

  messages = {
    samePlayerTurn: () =>
      `Player ${this.currentPlayer} rolled doubles and gets to roll again`,
    move: () =>
      `Player ${this.currentPlayer} is on square ${
        this.players[this.currentPlayer].position
      }`,
    ladder: () =>
      `Player ${this.currentPlayer} landed on a ladder and climbed to square ${
        this.players[this.currentPlayer].position
      }`,
    snake: () =>
      `Player ${this.currentPlayer} landed on a snake and fell to square ${
        this.players[this.currentPlayer].position
      }`,
    victory: () => `Player ${this.currentPlayer} Wins!`,
    gameOver: () =>
      `Game over! Player ${this.currentPlayer} has won in ${this.turnTotal} turns`,
  };

  turnMessages = [];

  gridReference;

  readyToAnimate = true;

  readyForNextTurn = true;

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

  setTokenRadius() {
    this.tokenRadius = Math.floor(this.boardSize / 45);
  }

  setContainerEl() {
    if (!this.containerEl) {
      const newDiv = document.createElement("div");
      newDiv.setAttribute("id", "game-container");
      newDiv.classList.add("game-container");
      this.containerEl = newDiv;
      document.body.appendChild(newDiv);
    }
  }

  setTurnMessages(message, isPlayer) {
    const playerColor = isPlayer
      ? this.players[this.currentPlayer].token.playerColor
      : false;
    const result = {
      message,
      playerColor,
    };
    this.turnMessages.push(result);
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
    this.setTurnMessages(this.messages.samePlayerTurn());
  }

  nextPlayerTurn() {
    this.setTurnMessages(this.messages.nextPlayerTurn());
  }

  isWon() {
    if (this.players[1].position === 100 || this.players[2].position === 100) {
      return true;
    }
    return false;
  }

  animateStep(props) {
    const animationState = props;
    animationState.done = animationState.cleanup;
    animationState.player = animationState.player || this.currentPlayer;
    const player = animationState.player || this.currentPlayer;
    animationState.otherPlayer = animationState.otherPlayer || this.otherPlayer;

    const playerXY = this.getDrawOffsetGridReference(player);
    const otherXY = this.getDrawOffsetGridReference(animationState.otherPlayer);

    this.tokenBoard.clear();
    this.tokenBoard.draw(
      ...otherXY,
      this.tokenRadius,
      this.players[animationState.otherPlayer].token.playerColor
    );
    this.tokenBoard.draw(
      ...playerXY,
      this.tokenRadius,
      this.players[player].token.playerColor
    );

    if (this.players[player].drawPos > this.players[player].position - 1) {
      this.players[player].drawPos = this.players[player].position;
      animationState.cleanup = true;
    }
    if (animationState.cleanup) {
      this.setDrawPosToPosition(player);
    } else {
      this.setDrawPos(player);
    }

    window.requestAnimationFrame(() => this.animate(animationState));
  }

  animate(props) {
    const animationState = props ?? {
      done: false,
      cleanup: false,
      player: null,
      otherPlayer: null,
    };
    this.readyToAnimate = animationState.done;

    if (!animationState.done) {
      this.animateStep(animationState);
    }
  }

  animatePortal(props) {
    const animationState = props ?? {
      done: false,
      cleanup: false,
      player: null,
      otherPlayer: null,
      xy: null,
    };
    this.readyToAnimate = animationState.done;

    if (!animationState.done) {
      this.animatePortalStep(animationState);
    }
  }

  animatePortalStep(props) {
    const animationState = props;
    animationState.done = animationState.cleanup;
    animationState.player = animationState.player || this.currentPlayer;
    animationState.otherPlayer = animationState.otherPlayer || this.otherPlayer;
    const player = animationState.player || this.currentPlayer;
    animationState.xy =
      animationState.xy || this.getDrawOffsetGridReference(player);

    const playerXY = animationState.xy;
    const otherXY = this.getDrawOffsetGridReference(animationState.otherPlayer);

    this.tokenBoard.clear();
    this.tokenBoard.draw(
      ...otherXY,
      this.tokenRadius,
      this.players[animationState.otherPlayer].token.playerColor
    );
    this.tokenBoard.draw(
      ...playerXY,
      this.tokenRadius,
      this.players[player].token.playerColor
    );
    const nextDrawXY = this.getNextDrawPoint(
      playerXY,
      this.getOffsetGridReference(player)
    );
    animationState.xy = nextDrawXY;
    const startPosition = this.getDrawOffsetGridReference(player);
    const endPosition = this.getOffsetGridReference(player);
    const isDrawXGreaterThanEndX = nextDrawXY[0] >= endPosition[0];
    const isDrawYGreaterThanEndY = nextDrawXY[1] >= endPosition[1];
    const doesPortalGoLeft = startPosition[0] > endPosition[0];
    const isPortalVertical = startPosition[0] === endPosition[0];
    const isLadder = startPosition[1] < endPosition[1];
    if (nextDrawXY[0] === endPosition[0] && nextDrawXY[1] === endPosition[1]) {
      animationState.cleanup = true;
    }
    if (isPortalVertical && isLadder && isDrawYGreaterThanEndY) {
      animationState.cleanup = true;
    }

    if (isPortalVertical && !isLadder && !isDrawYGreaterThanEndY) {
      animationState.cleanup = true;
    }

    if (
      isLadder &&
      doesPortalGoLeft &&
      !isDrawXGreaterThanEndX &&
      isDrawYGreaterThanEndY
    ) {
      animationState.cleanup = true;
    }

    if (
      isLadder &&
      !doesPortalGoLeft &&
      isDrawXGreaterThanEndX &&
      isDrawYGreaterThanEndY
    ) {
      animationState.cleanup = true;
    }

    if (
      !isLadder &&
      doesPortalGoLeft &&
      !isDrawXGreaterThanEndX &&
      !isDrawYGreaterThanEndY
    ) {
      animationState.cleanup = true;
    }

    if (
      !isLadder &&
      !doesPortalGoLeft &&
      isDrawXGreaterThanEndX &&
      !isDrawYGreaterThanEndY
    ) {
      animationState.cleanup = true;
    }

    if (animationState.cleanup) {
      this.setDrawPosToPosition(player);
    }
    window.requestAnimationFrame(() => this.animatePortal(animationState));
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

  // getDrawPositionGridReference(player) {
  //   if (player) {
  //     return (
  //       this.gridReference[this.players[player].drawPos - 1] ||
  //       this.gridReference[0]
  //     );
  //   }
  //   return (
  //     this.gridReference[this.players[this.currentPlayer].drawPos - 1] ||
  //     this.gridReference[0]
  //   );
  // }

  // getPositionGridReference(player) {
  //   if (player) {
  //     return (
  //       this.gridReference[this.players[player].position - 1] ||
  //       this.gridReference[0]
  //     );
  //   }
  //   return (
  //     this.gridReference[this.players[this.currentPlayer].position - 1] ||
  //     this.gridReference[0]
  //   );
  // }

  getDrawOffsetGridReference(player) {
    const position = this.players[player].drawPos
      ? this.players[player].drawPos - 1
      : 0;
    const radiusOffset =
      player === 1 ? this.tokenRadius : this.tokenRadius * -1;
    const x = this.gridReference[position][0];
    const y = this.gridReference[position][1];
    return [x + radiusOffset, y + radiusOffset];
  }

  getOffsetGridReference(player) {
    const position = this.players[player].position - 1;
    const radiusOffset =
      player === 1 ? this.tokenRadius : this.tokenRadius * -1;
    const x = this.gridReference[position][0];
    const y = this.gridReference[position][1];
    return [x + radiusOffset, y + radiusOffset];
  }

  checkPortal() {
    const isSnakePortal =
      this.gameBoard.snakes[this.players[this.currentPlayer].position];
    if (isSnakePortal) {
      this.players[this.currentPlayer].position +=
        this.gameBoard.snakes[this.players[this.currentPlayer].position];
      this.setTurnMessages(this.messages.snake(), true);
      return true;
    }
    const isLadderPortal =
      this.gameBoard.ladders[this.players[this.currentPlayer].position];
    if (isLadderPortal) {
      this.players[this.currentPlayer].position +=
        this.gameBoard.ladders[this.players[this.currentPlayer].position];
      this.setTurnMessages(this.messages.ladder(), true);
      return true;
    }
    return false;
  }

  animationcomplete() {
    const poll = (resolve) => {
      if (this.readyToAnimate === true) resolve();
      else setTimeout(() => poll(resolve), 200);
    };

    return new Promise(poll);
  }

  async play() {
    if (this.victory) {
      this.setTurnMessages(this.messages.gameOver());
      return this.turnMessages;
    }
    if (!this.readyForNextTurn) {
      return [];
    }
    this.turnTotal += 1;
    this.readyForNextTurn = false;
    this.turnMessages = [];
    this.turnDice = this.rollDice();
    this.diceTotal = this.rollTotal();
    this.setPlayerPosition();
    this.setTurnMessages(this.messages.move(), true);
    this.animate();
    await this.animationcomplete();
    const isPortal = this.checkPortal();
    if (isPortal) {
      this.animatePortal();
      await this.animationcomplete();
    }

    this.victory = this.isWon();
    if (this.victory) {
      this.setTurnMessages(this.messages.victory());
      return this.turnMessages;
    }

    if (this.isDoubles()) {
      this.samePlayerTurn();
      this.readyForNextTurn = true;
      return this.turnMessages;
    }
    this.setCurrentPlayer();
    this.readyForNextTurn = true;
    return this.turnMessages;
  }

  init() {
    this.setContainerEl();
    this.setBoardSize();
    this.setTokenRadius();
    this.gameBoard = new GameBoard(this.containerEl, this.boardSize);
    this.tokenBoard = new TokenBoard(this.containerEl, this.boardSize);
    this.gridReference = this.gameBoard.gridReference;
    this.animate();
  }
}

export default SnakesAndLadders;
