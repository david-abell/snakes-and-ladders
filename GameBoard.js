"use-strict";

// This will not work if a containerEl is not passed at initialization
class GameBoard {
  canvas;

  context;

  gridReference = [];

  snakes = {
    16: -10,
    46: -21,
    49: -38,
    62: -43,
    64: -4,
    74: -21,
    89: -21,
    92: -4,
    95: -20,
    99: -19,
  };

  ladders = {
    2: 36,
    7: 7,
    8: 23,
    15: 11,
    21: 21,
    28: 56,
    36: 8,
    51: 16,
    71: 20,
    78: 20,
    87: 7,
  };

  constructor(containerEl, size) {
    if (!containerEl) throw new Error(`Missing container el`);
    if (!size) throw new Error(`Missing size parameter`);

    this.containerEl = containerEl;
    this.boardSize = size;
    this.init();
  }

  setCanvas() {
    if (!document.getElementById("game-board")) {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("id", "game-board");
      document.getElementById("game-container").appendChild(canvas);
    }
    this.canvas = document.getElementById("game-board");
    this.canvas.width = this.boardSize;
    this.canvas.height = this.boardSize;
    this.context = this.canvas.getContext("2d");
  }

  drawGridLines() {
    this.context.beginPath();
    this.context.fillStyle = "#F9FAFB";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const { width } = this.canvas;
    const { height } = this.canvas;
    const gridCount = width / 10;

    this.context.beginPath();
    this.context.strokeStyle = "black";
    this.context.lineWidth = 1;

    // Draw grid lines
    for (let x = 0; x <= width; x += gridCount) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, height);
    }

    for (let y = 0; y <= height; y += gridCount) {
      this.context.moveTo(0, y);
      this.context.lineTo(width, y);
    }
  }

  drawLettersAndSaveCoordinates() {
    const { width } = this.canvas;
    const { height } = this.canvas;
    const gridCount = width / 10;

    // Create grid reference and Draw grid numbers
    this.context.stroke();

    this.context.font = "20px Lato";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillStyle = "#343C47";

    for (let i = 0; i < 100; i += 1) {
      const isEvenRow = Math.floor(i / 10) % 2 === 0;
      const yOffset = Math.floor(i / 10) * gridCount;
      let squareXStart = gridCount / 2 + gridCount * i - yOffset * 10;
      if (!isEvenRow) {
        squareXStart = width - (gridCount / 2 + gridCount * i - yOffset * 10);
      }

      const squareYStart = height - (gridCount / 2 + yOffset);

      this.context.fillText(`${i + 1}`, squareXStart, squareYStart);
      this.gridReference.push([squareXStart, squareYStart]);
    }
  }

  init() {
    this.setCanvas();
    this.drawGridLines();
    this.drawLettersAndSaveCoordinates();
  }
}

export default GameBoard;
