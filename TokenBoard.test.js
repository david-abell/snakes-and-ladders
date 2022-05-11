import TokenBoard from "./TokenBoard.js";

describe("drawGrid", () => {
  test("", () => {});
});

describe("init", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="board-container"></div>`;
  });

  test("throw an error if size parameter missing", () => {
    const containerEl = document.getElementById("board-container");
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

  test("should create canvas element in board-container", () => {
    const containerEl = document.getElementById("board-container");
    // eslint-disable-next-line no-unused-vars
    const game = new TokenBoard(containerEl, 800);
    const gameBoard = document.getElementById("token-board");
    expect(gameBoard).toBeTruthy();
  });
});

describe("draw", () => {
  let containerEl;
  let game;
  beforeEach(() => {
    containerEl = document.createElement("div");
    game = new TokenBoard(containerEl, 800);
  });

  test(`should return the player token`, () => {
    const playerToken = game.draw(15, 15, 15, "#FE7E6D");
    expect(playerToken instanceof Path2D).toBeTruthy();
  });

  test(`should draw a player token on the board context`, () => {
    // eslint-disable-next-line no-unused-vars
    const playerToken = game.draw(15, 10, 15, "#FE7E6D");
    // eslint-disable-next-line no-underscore-dangle
    const events = game.context.__getEvents();
    expect(events).toMatchSnapshot();
  });
});
