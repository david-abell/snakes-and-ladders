import Messages from "../js/Messages.js";

let messageContainer;

describe("methods", () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <div id="game-container"></div>
    <div id="message-container">
      <ol role="list" id="messages" class="messages">
        <li><b>Click play to start a new game</b></li>
      </ol>
    </div>`;
    messageContainer = document.getElementById("message-container");
  });

  test("should have only welcome message", () => {
    const instance = new Messages(messageContainer);
    expect(instance.messageList).toHaveLength(1);
  });

  test("create list item should have a li and color", () => {
    const testMessage = {
      message: "this is a test",
      playerColor: "#FE7E6D",
    };

    const listEl = Messages.createListItem(testMessage);
    document.getElementById("messages").appendChild(listEl);
    expect(document.querySelector("li:last-child").innerHTML).toMatch(
      /this is a test/
    );
    expect(document.querySelector("li:last-child").style.color).toBe("#FE7E6D");
  });

  test("create list item should not have color", () => {
    const testMessage = {
      message: "this is a test",
    };

    const listEl = Messages.createListItem(testMessage);
    document.getElementById("messages").appendChild(listEl);
    expect(document.querySelector("li:last-child").innerHTML).toMatch(
      /this is a test/
    );
    expect(document.querySelector("li:last-child").style.color).toBeFalsy();
  });
});
