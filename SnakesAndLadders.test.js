import Messages from "./Messages.js";
import SnakesAndLadders from "./SnakesAndLadders.js";

let boardContainer;
let messageContainer;
let gridContainer;

describe("Player should", () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    document.body.innerHTML = `
    <div id="grid-container">
    <div id="board-container"></div>
    <div id="message-container">
      <ol role="list" id="messages" class="messages">
        <li><b>Click play to start a new game</b></li>
      </ol>
    </div>
    </div>`;
    boardContainer = document.getElementById("board-container");
    messageContainer = document.getElementById("message-container");
    gridContainer = document.getElementById("grid-container");
    gridContainer.offsetWidth = 1600;
  });
  test("get another turn when doubles are rolled", async () => {
    const game = new SnakesAndLadders(boardContainer, messageContainer);
    jest
      .spyOn(game, "rollDice")
      .mockReturnValueOnce({ die1: 1, die2: 1 })
      .mockReturnValueOnce({ die1: 1, die2: 1 })
      .mockReturnValueOnce({ die1: 1, die2: 2 })
      .mockReturnValueOnce({ die1: 3, die2: 3 })
      .mockReturnValueOnce({ die1: 2, die2: 3 });
    await game.play();
    expect(game.isDoubles()).toBe(true);
    await game.play();
    expect(game.isDoubles()).toBe(true);
    expect(game.currentPlayer).toBe(1);
    await game.play();
    expect(game.isDoubles()).toBe(false);
    expect(game.currentPlayer).toBe(2);
    await game.play();
    expect(game.isDoubles()).toBe(true);
    expect(game.currentPlayer).toBe(2);
    await game.play();
    expect(game.isDoubles()).toBe(false);
    expect(game.currentPlayer).toBe(1);
  });
});

describe("rollDice method", () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    document.body.innerHTML = `
    <div id="grid-container">
    <div id="board-container"></div>
    <div id="message-container">
      <ol role="list" id="messages" class="messages">
        <li><b>Click play to start a new game</b></li>
      </ol>
    </div>
    </div>`;
    boardContainer = document.getElementById("board-container");
    messageContainer = document.getElementById("message-container");
    gridContainer = document.getElementById("grid-container");
    gridContainer.offsetWidth = 1600;
  });

  test("should return two dice with number values", () => {
    const game = new SnakesAndLadders(boardContainer, messageContainer);
    const value = game.rollDice();
    expect(value).toEqual(
      expect.objectContaining({
        die1: expect.any(Number),
        die2: expect.any(Number),
      })
    );
  });

  test("should be numbers from 1 to 6", () => {
    const game = new SnakesAndLadders(boardContainer, messageContainer);
    const value = game.rollDice();
    expect(value.die1).toBeGreaterThanOrEqual(1);
    expect(value.die1).toBeLessThanOrEqual(6);
    expect(value.die2).toBeGreaterThanOrEqual(1);
    expect(value.die2).toBeLessThanOrEqual(6);
  });
});

describe("messages", () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    document.body.innerHTML = `
    <div id="grid-container">
    <div id="board-container"></div>
    <div id="message-container">
      <ol role="list" id="messages" class="messages">
        <li><b>Click play to start a new game</b></li>
      </ol>
    </div>
    </div>`;
    boardContainer = document.getElementById("board-container");
    messageContainer = document.getElementById("message-container");
    gridContainer = document.getElementById("grid-container");
    gridContainer.offsetWidth = 1600;
  });

  test("should be a message instance", () => {
    const game = new SnakesAndLadders(boardContainer, messageContainer);
    expect(game.messages).toBeInstanceOf(Messages);
  });

  test("should show the correct player and square", async () => {
    const game = new SnakesAndLadders(boardContainer, messageContainer);
    jest.spyOn(game, "rollDice").mockReturnValueOnce({ die1: 1, die2: 5 });
    await game.play();
    expect(document.querySelector("li:last-child").innerHTML).toMatch(
      /Player 1 is on square 6/
    );
    expect(document.querySelector("li:last-child").innerHTML).not.toMatch(
      /Player 2 is on square 6/
    );
  });

  test("should be a doubles message with color undefined", async () => {
    const game = new SnakesAndLadders(boardContainer, messageContainer);
    jest.spyOn(game, "rollDice").mockReturnValueOnce({ die1: 2, die2: 2 });
    await game.play();
    expect(game.messages.messageList).toHaveLength(3);
    expect(document.querySelector("li:last-child").innerHTML).toMatch(
      /Player 1 rolled doubles and gets to roll again/
    );
    expect(document.querySelector("li:last-child").style.color).toBeFalsy();
  });
});

describe("Init", () => {
  global.innerWidth = 1920;
  global.innerHeight = 1080;
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    document.body.innerHTML = `
    <div id="grid-container">
    <div id="board-container"></div>
    <div id="message-container">
      <ol role="list" id="messages" class="messages">
        <li><b>Click play to start a new game</b></li>
      </ol>
    </div>
    </div>`;
    boardContainer = document.getElementById("board-container");
    messageContainer = document.getElementById("message-container");
    gridContainer = document.getElementById("grid-container");
    gridContainer.offsetWidth = 1600;
  });

  test("should create game container", () => {
    document.getElementById("board-container").remove();
    boardContainer = null;
    // eslint-disable-next-line no-unused-vars
    const game = new SnakesAndLadders(boardContainer, messageContainer);
    boardContainer = document.getElementById("board-container");
    expect(boardContainer).toBeTruthy();
  });

  test("too large", () => {
    const game = new SnakesAndLadders(boardContainer, messageContainer, 1200);
    expect(game.boardSize).toBe(1000);
  });
  test("too small", () => {
    const game = new SnakesAndLadders(boardContainer, messageContainer, 20);
    expect(game.boardSize).toBe(250);
  });
  test("decimal", () => {
    const game = new SnakesAndLadders(boardContainer, messageContainer, 0.8);
    expect(game.boardSize).toBe(250);
  });
  test("400px", () => {
    const game = new SnakesAndLadders(
      boardContainer,
      messageContainer,
      "400px"
    );
    expect(game.boardSize).toBe(250);
  });
  test("0", () => {
    const game = new SnakesAndLadders(boardContainer, messageContainer);
    expect(game.boardSize).toBe(800);
  });
});
