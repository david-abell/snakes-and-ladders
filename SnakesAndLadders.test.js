import SnakesAndLadders from "./SnakesAndLadders.js";

describe("Properties", () => {
  test("Player should get another turn when doubles are rolled", () => {
    const game = new SnakesAndLadders();
    jest
      .spyOn(game, "rollDice")
      .mockReturnValueOnce({ die1: 1, die2: 1 })
      .mockReturnValueOnce({ die1: 1, die2: 1 })
      .mockReturnValueOnce({ die1: 1, die2: 2 })
      .mockReturnValueOnce({ die1: 3, die2: 3 })
      .mockReturnValueOnce({ die1: 2, die2: 3 });

    game.play();
    game.play();
    expect(game.currentPlayer).toBe(1);
    game.play();
    expect(game.currentPlayer).toBe(2);
    game.play();
    expect(game.currentPlayer).toBe(2);
    game.play();
    expect(game.currentPlayer).toBe(1);
  });
});

describe("method roll dice", () => {
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

describe("incomplete four dice roll game", () => {
  test("it should create new game board and roll dice four times", () => {
    const game = new SnakesAndLadders();
    jest
      .spyOn(game, "rollDice")
      .mockReturnValueOnce({ die1: 1, die2: 1 })
      .mockReturnValueOnce({ die1: 1, die2: 5 })
      .mockReturnValueOnce({ die1: 6, die2: 2 })
      .mockReturnValueOnce({ die1: 1, die2: 1 });

    let value = game.play();
    expect(value).toBe("Player 1 is on square 38");
    value = game.play();
    expect(value).toBe("Player 1 is on square 44");
    value = game.play();
    expect(value).toBe("Player 2 is on square 31");
    value = game.play();
    expect(value).toBe("Player 1 is on square 25");
  });
});

describe("Game ending", () => {
  test("should declare a winner", () => {
    const game = new SnakesAndLadders();
    game.player1 = 98;
    jest.spyOn(game, "rollDice").mockReturnValueOnce({ die1: 1, die2: 1 });
    const value = game.play();
    expect(value).not.toBe("Player 2 Wins!");
    expect(value).toBe("Player 1 Wins!");
  });
  test("should declare game over", () => {
    const game = new SnakesAndLadders();
    game.player1 = 98;
    jest.spyOn(game, "rollDice").mockReturnValueOnce({ die1: 1, die2: 1 });
    game.play();
    game.play();
    const value = game.play();
    expect(value).not.toBe("Player 1 Wins!");
    expect(value).not.toBe("Player 2 Wins!");
    expect(value).toBe("Game over!");
  });
});
