import SnakesAndLadders from "./SnakesAndLadders.js";

// describe("Properties", () => {
//   beforeEach(() => {
//     document.body.innerHTML = `<div id="game-container"></div>`;
//   });
//   test("Player should get another turn when doubles are rolled", () => {
//     const game = new SnakesAndLadders();
//     jest
//       .spyOn(game, "rollDice")
//       .mockReturnValueOnce({ die1: 1, die2: 1 })
//       .mockReturnValueOnce({ die1: 1, die2: 1 })
//       .mockReturnValueOnce({ die1: 1, die2: 2 })
//       .mockReturnValueOnce({ die1: 3, die2: 3 })
//       .mockReturnValueOnce({ die1: 2, die2: 3 });
//     game.play();
//     expect(game.isDoubles()).toBe(true);
//     game.play();
//     expect(game.isDoubles()).toBe(true);
//     expect(game.currentPlayer).toBe(1);
//     game.play();
//     expect(game.isDoubles()).toBe(false);
//     expect(game.currentPlayer).toBe(2);
//     game.play();
//     expect(game.isDoubles()).toBe(true);
//     expect(game.currentPlayer).toBe(2);
//     game.play();
//     expect(game.isDoubles()).toBe(false);
//     expect(game.currentPlayer).toBe(1);
//   });
// });

describe("rollDice method", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="game-container"></div>`;
  });

  test("should return two dice with number values", () => {
    const game = new SnakesAndLadders();
    const value = game.rollDice();
    expect(value).toEqual(
      expect.objectContaining({
        die1: expect.any(Number),
        die2: expect.any(Number),
      })
    );
  });

  test("should be numbers from 1 to 6", () => {
    const game = new SnakesAndLadders();
    const value = game.rollDice();
    expect(value.die1).toBeGreaterThanOrEqual(1);
    expect(value.die1).toBeLessThanOrEqual(6);
    expect(value.die2).toBeGreaterThanOrEqual(1);
    expect(value.die2).toBeLessThanOrEqual(6);
  });
});

describe("turn messages", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="game-container"></div>`;
  });

  test("should be an array", () => {
    const game = new SnakesAndLadders();
    game.play();
    expect(Array.isArray(game.turnMessages)).toBeTruthy();
  });

  test("should show only victory message", () => {
    const game = new SnakesAndLadders();
    game.victory = true;
    game.play();
    expect(game.turnMessages).toHaveLength(1);
  });

  test("should have message and playerColor keys", () => {
    const game = new SnakesAndLadders();
    game.victory = true;
    game.play();
    expect(game.turnMessages[0]).toHaveProperty("message");
    expect(game.turnMessages[0]).toHaveProperty("playerColor");
  });

  test("playerColor should not be defined", () => {
    const game = new SnakesAndLadders();
    game.victory = true;

    game.play();
    expect(game.turnMessages[0].playerColor).toBeFalsy();
  });

  test("player1 playerColor should be a color string", () => {
    const game = new SnakesAndLadders();
    game.play();
    expect(game.turnMessages[0].playerColor).toMatch(/#FE7E6D/);
  });

  test("should show the correct player and square", () => {
    const game = new SnakesAndLadders();
    jest.spyOn(game, "rollDice").mockReturnValueOnce({ die1: 1, die2: 5 });
    game.play();
    expect(game.turnMessages[0].message).toBe("Player 1 is on square 6");
  });

  test("should be a doubles message with color undefined", async () => {
    const game = new SnakesAndLadders();
    jest.spyOn(game, "rollDice").mockReturnValueOnce({ die1: 1, die2: 1 });
    const turnMessages = await game.play();
    expect(turnMessages).toHaveLength(3);
    expect(turnMessages[2].message).toMatch(
      /Player 1 rolled doubles and gets to roll again/
    );
    expect(turnMessages[2].playerColor).toBeFalsy();
  });
});

// test("too large", () => {
//   const game = new GameBoard(undefined, 2000);
//   expect(game.height).toBe(980);
// });
// test("too small", () => {
//   const game = new GameBoard(undefined, 20);
//   expect(game.height).toBe(250);
// });
// test("decimal", () => {
//   const game = new GameBoard(undefined, 0.8);
//   expect(game.height).toBe(250);
// });
// test("400px", () => {
//   const game = new GameBoard(undefined, "400px");
//   expect(game.height).toBe(250);
// });
// test("0", () => {
//   const game = new GameBoard();
//   expect(game.height).toBe(250);
// });
