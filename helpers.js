function getRandomDie() {
  return Math.floor(Math.random() * 6 + 1);
}

function getSlope(x1, y1, x2, y2) {
  return (y2 - y1) / (x2 - x1);
}

function getIntercept(x1, y1, slope) {
  return y1 - slope * x1;
}

export { getRandomDie, getSlope, getIntercept };
