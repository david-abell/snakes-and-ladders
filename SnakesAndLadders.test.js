const SnakesAndLadders = require("./SnakesAndLadders.js");

describe("Properties", () => {
  test("Player should get another turn when doubles are rolled", () => {
    const game = new SnakesAndLadders();

    game.play(2, 2);
    game.play(2, 2);
    expect(game.currentPlayer).toBe(1);
    game.play(1, 2);
    expect(game.currentPlayer).toBe(2);
    game.play(3, 3);
    expect(game.currentPlayer).toBe(2);
  });
});

describe("method roll dice", () => {
  test("should return two dice with number values", () => {
    const game = new SnakesAndLadders();
    let value = game.rollDice();
    expect(value).toEqual(
      expect.objectContaining({
        die1: expect.any(Number),
        die2: expect.any(Number),
      })
    );
  });

  test("should be numbers from 1 to 6", () => {
    const game = new SnakesAndLadders();
    let value = game.rollDice();
    expect(value.die1).toBeGreaterThanOrEqual(1);
    expect(value.die1).toBeLessThanOrEqual(6);
    expect(value.die2).toBeGreaterThanOrEqual(1);
    expect(value.die2).toBeLessThanOrEqual(6);
  });
});

describe("incomplete four dice roll game", () => {
  test("it should create new game board and roll dice four times", () => {
    const game = new SnakesAndLadders();

    let value = game.play(1, 1);
    expect(value).toBe("Player 1 is on square 38");
    value = game.play(1, 5);
    expect(value).toBe("Player 1 is on square 44");
    value = game.play(6, 2);
    expect(value).toBe("Player 2 is on square 31");
    value = game.play(1, 1);
    expect(value).toBe("Player 1 is on square 25");
  });
});

describe("Game ending", () => {
  test("should declare a winner", () => {
    const game = new SnakesAndLadders();
    game.player1 = 98;
    let value = game.play(1, 1);
    expect(value).not.toBe("Player 2 Wins!");
    expect(value).toBe("Player 1 Wins!");
    value = game.play(2, 1);
  });
  test("should declare game over", () => {
    const game = new SnakesAndLadders();
    game.player1 = 98;
    let value = game.play(1, 1);
    value = game.play(2, 1);
    expect(value).not.toBe("Player 1 Wins!");
    expect(value).not.toBe("Player 2 Wins!");
    expect(value).toBe("Game over!");
  });
});
