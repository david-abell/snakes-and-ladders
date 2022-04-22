"use-strict";

import SnakesAndLadders from "./SnakesAndLadders.js";

const game = new SnakesAndLadders(600);

window.onload = game.init();

const playButton = document.querySelector("#play-turn");
const message = document.querySelector("#message");

playButton.addEventListener("click", () => {
  game.play();
  message.innerHTML = game.message;
});
