"use-strict";

import SnakesAndLadders from "./SnakesAndLadders.js";

const game = new SnakesAndLadders(800);

window.onload = game.init();

const playButton = document.querySelector("#play-turn");

playButton.addEventListener("click", () => {
  game.play();
});
