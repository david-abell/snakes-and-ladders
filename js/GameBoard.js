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
      this.containerEl.appendChild(canvas);
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
      let squareXStart = Math.round(
        gridCount / 2 + gridCount * i - yOffset * 10
      );
      if (!isEvenRow) {
        squareXStart = Math.round(
          width - (gridCount / 2 + gridCount * i - yOffset * 10)
        );
      }

      const squareYStart = Math.round(height - (gridCount / 2 + yOffset));

      this.context.fillText(`${i + 1}`, squareXStart, squareYStart);
      this.gridReference.push([squareXStart, squareYStart]);
    }
  }

  drawPortals() {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(this.ladders)) {
      this.drawLadder(Number(key));
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(this.snakes)) {
      this.drawSnake(Number(key));
    }
  }

  drawLine(x1, y1, x2, y2, style) {
    Object.assign(this.context, style);
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

  drawRungs(ladder) {
    const style = { ...ladder.style };
    const rungLength = 40;
    const step = rungLength * 0.5;
    const xOffset = step * ladder.tan();
    const startX = ladder.from.x - 20 + xOffset;
    let nextX = startX;
    for (
      let yi = ladder.from.y - step;
      yi > ladder.to.y + 0.2 * step;
      yi -= step
    ) {
      this.drawLine(nextX, yi, nextX + rungLength, yi, style);
      nextX += xOffset;
    }
  }

  drawLadder(position) {
    if (!this.ladders[position]) {
      return;
    }
    const toPosition = position + this.ladders[position];

    // from Mathias Bynens' comment @ https://www.paulirish.com/2009/random-hex-color-code-snippets/
    const randomColor = `#${Math.floor(Math.random() * 16777216).toString(16)}`;

    const ladder = {
      from: {
        x: this.gridReference[position - 1][0],
        y: this.gridReference[position - 1][1],
      },
      to: {
        x: this.gridReference[toPosition - 1][0],
        y: this.gridReference[toPosition - 1][1],
      },
      height() {
        return this.from.y - this.to.y;
      },
      width() {
        return this.to.x - this.from.x;
      },
      tan() {
        return this.width() / this.height();
      },
      style: { strokeStyle: randomColor, lineWidth: 4 },
    };
    const lineGap = 20;
    this.drawLine(
      ladder.from.x - lineGap,
      ladder.from.y,
      ladder.to.x - lineGap,
      ladder.to.y,
      ladder.style
    );

    this.drawLine(
      ladder.from.x + lineGap,
      ladder.from.y,
      ladder.to.x + lineGap,
      ladder.to.y,
      ladder.style
    );

    this.drawRungs(ladder);
  }

  drawSnake(position) {
    if (!this.snakes[position]) {
      return;
    }
    const toPosition = position + this.snakes[position];
    // from Mathias Bynens' comment @ https://www.paulirish.com/2009/random-hex-color-code-snippets/
    const randomColor = `#${Math.floor(Math.random() * 16777216).toString(16)}`;
    const snake = {
      from: {
        x: this.gridReference[position - 1][0],
        y: this.gridReference[position - 1][1],
      },
      to: {
        x: this.gridReference[toPosition - 1][0],
        y: this.gridReference[toPosition - 1][1],
      },
      height() {
        return this.from.y - this.to.y;
      },
      width() {
        return this.to.x - this.from.x;
      },
      tan() {
        return this.width() / this.height();
      },
      style: {
        strokeStyle: randomColor,
        fillStyle: randomColor,
        lineWidth: 12,
      },
    };
    Object.assign(this.context, snake.style);

    let { x } = snake.from;
    let { y } = snake.from;
    // let start = true;
    const amplitude = 30;
    const frequency = 20;
    this.context.beginPath();
    while (y < snake.to.y) {
      x =
        snake.from.x +
        amplitude * Math.sin(y / frequency) +
        snake.tan() * snake.from.y -
        snake.tan() * y;
      // if (start) {
      //   start = false;
      //   const head = new Path2D();
      //   head.ellipse(x + 5, y - 12, 12, 22, Math.PI, 0, 2 * Math.PI);
      //   this.context.fill(head);
      // }

      this.context.lineTo(x, y);
      y += 1;
    }
    this.context.stroke();
  }

  init() {
    this.setCanvas();
    this.drawGridLines();
    this.drawLettersAndSaveCoordinates();
    this.drawPortals();
  }
}

export default GameBoard;
