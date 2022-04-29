"use-strict";

import SnakesAndLadders from "./SnakesAndLadders.js";

const gameBoards = document.getElementById("game-container");
const game = new SnakesAndLadders(gameBoards, 600);

// window.onload = game.init();

const playButton = document.querySelector("#play-turn");
const message = document.querySelector("#message");

playButton.addEventListener("click", () => {
  game.play();
  message.innerHTML = game.message;
});
