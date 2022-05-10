"use-strict";

import SnakesAndLadders from "./SnakesAndLadders.js";
// import { debounce } from "./helpers.js";

// const gridContainer = document.getElementById("grid-container");
const gameBoards = document.getElementById("board-container");
const messages = document.querySelector("#messages");
const game = new SnakesAndLadders(gameBoards, messages, 1000);

const playButton = document.querySelector("#play-turn");

// window.addEventListener(
//   "resize",
//   debounce(() => {
//     game.init;
//   })
// );

playButton.addEventListener("click", () => {
  game.play();
});
