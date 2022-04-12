"use-strict";

import SnakesAndLadders from "./SnakesAndLadders.js";

const game = new SnakesAndLadders(800);

console.log(game);

window.onload = game.init();
