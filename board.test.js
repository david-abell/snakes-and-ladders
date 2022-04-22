import { initBoard, game } from "./board.js";

global.innerHeight = 980;
global.innerWidth = 1740;

describe("drawGrid", () => {
  test("", () => {});
});

describe("initBoard size setup", () => {
  beforeEach(() => jest.resetModules());
  test("boardsize should default to 250px", () => {
    initBoard();
    expect(game.height).toBe(250);
  });
  test("too large", () => {
    initBoard(2000);
    expect(game.height).toBe(980);
  });
  test("too small", () => {
    initBoard(20);
    expect(game.height).toBe(250);
  });
  test("decimal", () => {
    initBoard(0.8);
    expect(game.height).toBe(250);
  });
  test("400px", () => {
    initBoard("400px");
    expect(game.height).toBe(250);
  });
  test("0", () => {
    initBoard(0);
    expect(game.height).toBe(250);
  });
});
