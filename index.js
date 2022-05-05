"use-strict";

import SnakesAndLadders from "./SnakesAndLadders.js";

const gameBoards = document.getElementById("game-container");
const game = new SnakesAndLadders(gameBoards, 600);

const playButton = document.querySelector("#play-turn");
const messages = document.querySelector("#messages");

playButton.addEventListener("click", async () => {
  const turnResult = await game.play();
  turnResult.forEach((el) => {
    const { message, playerColor } = el;
    const newMessage = document.createElement("li");
    newMessage.style.color = playerColor;
    newMessage.innerText = message;
    messages.prepend(newMessage);
  });
});
