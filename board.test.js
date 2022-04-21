/**
 * @jest-environment jsdom
 */
import { drawGrid, initBoard, game } from "./board.js";

global.innerHeight = 1000;
global.innerWidth = 1760;
describe("drawGrid", () => {
  test("", () => {});
});

describe("initBoard", () => {
  beforeEach(() => jest.resetModules());
  test("", () => {});
  test("boardsize should default to 800px", () => {
    initBoard();
    expect(game.height).toBe(800);
  });
  test("board should expect random input sizes", () => {});
});
