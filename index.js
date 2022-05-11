"use-strict";

import SnakesAndLadders from "./SnakesAndLadders.js";

const gameBoards = document.getElementById("board-container");
const messages = document.querySelector("#messages");
const game = new SnakesAndLadders(gameBoards, messages, 1000);

const playButton = document.querySelector("#play-button");

playButton.addEventListener("click", () => {
  game.play();
});
