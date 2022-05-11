import GameBoard from "../src/GameBoard.js";

describe("drawGrid", () => {
  test("", () => {});
});

describe("setup", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="board-container"></div>`;
  });

  test("throw an error if container parameter missing", () => {
    const boardConstructor = () => {
      // eslint-disable-next-line no-new
      new GameBoard();
    };
    expect(boardConstructor).toThrowError(/Missing container el/);
  });

  test("throw an error if size parameter missing", () => {
    const containerEl = document.getElementById("board-container");
    const boardConstructor = () => {
      // eslint-disable-next-line no-new
      new GameBoard(containerEl);
    };
    expect(boardConstructor).toThrowError(/Missing size parameter/);
  });

  test("should create canvas element in board-container", () => {
    const containerEl = document.getElementById("board-container");
    // eslint-disable-next-line no-unused-vars
    const game = new GameBoard(containerEl, 800);
    const gameBoard = document.getElementById("game-board");
    expect(gameBoard).toBeTruthy();
  });

  // test should create context
});

// Test methods
