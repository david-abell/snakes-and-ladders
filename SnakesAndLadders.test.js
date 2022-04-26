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
    game.init();
    game.play();
    expect(game.isDoubles).toBe(true);
    game.play();
    expect(game.isDoubles).toBe(true);
    expect(game.currentPlayer).toBe(1);
    game.play();
    expect(game.isDoubles).toBe(false);
    expect(game.currentPlayer).toBe(2);
    game.play();
    expect(game.isDoubles).toBe(true);
    expect(game.currentPlayer).toBe(2);
    game.play();
    expect(game.isDoubles).toBe(false);
    expect(game.currentPlayer).toBe(1);
  });
});

describe("method roll dice", () => {
  test("should return two dice with number values", () => {
    const game = new SnakesAndLadders();
    game.init();
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
    game.init();
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
    game.init();

    jest
      .spyOn(game, "rollDice")
      .mockReturnValueOnce({ die1: 1, die2: 1 })
      .mockReturnValueOnce({ die1: 1, die2: 5 })
      .mockReturnValueOnce({ die1: 6, die2: 2 })
      .mockReturnValueOnce({ die1: 1, die2: 1 });

    game.play();
    expect(game.message).toBe("Player 1 is on square 38");
    game.play();
    expect(game.message).toBe("Player 1 is on square 44");
    game.play();
    expect(game.message).toBe("Player 2 is on square 31");
    game.play();
    expect(game.message).toBe("Player 1 is on square 25");
  });
});

describe("Game ending", () => {
  test("should declare a winner", () => {
    const game = new SnakesAndLadders();
    game.init();
    game.players[1].position = 98;
    jest.spyOn(game, "rollDice").mockReturnValueOnce({ die1: 1, die2: 1 });
    game.play();
    expect(game.message).not.toBe("Player 2 Wins!");
    expect(game.message).toBe("Player 1 Wins!");
  });
  test("should declare game over", () => {
    const game = new SnakesAndLadders();
    game.init();
    game.players[1].position = 98;
    jest.spyOn(game, "rollDice").mockReturnValueOnce({ die1: 1, die2: 1 });
    game.play();
    game.play();
    expect(game.message).not.toBe("Player 1 Wins!");
    expect(game.message).not.toBe("Game over! Player 2 has won!");
    expect(game.message).toBe("Game over! Player 1 has won!");
  });
});
