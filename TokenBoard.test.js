import TokenBoard from "./TokenBoard.js";

describe("drawGrid", () => {
  test("", () => {});
});

describe("setup", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="game-container"></div>`;
  });

  test("throw an error if size parameter missing", () => {
    const containerEl = document.getElementById("game-container");
    const boardConstructor = () => {
      // eslint-disable-next-line no-new
      new TokenBoard(containerEl);
    };
    expect(boardConstructor).toThrowError(/Missing size parameter/);
  });

  test("throw an error if container parameter missing", () => {
    const boardConstructor = () => {
      // eslint-disable-next-line no-new
      new TokenBoard();
    };
    expect(boardConstructor).toThrowError(/Missing container el/);
  });

  test("should create canvas element in game-container", () => {
    const containerEl = document.getElementById("game-container");
    // eslint-disable-next-line no-unused-vars
    const game = new TokenBoard(containerEl, 800);
    const gameBoard = document.getElementById("token-board");
    expect(gameBoard).toBeTruthy();
  });

  // test should create context
});

// Test methods
