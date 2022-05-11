function getRandomDie() {
  return Math.floor(Math.random() * 6 + 1);
}

function getSlope(x1, y1, x2, y2) {
  return (y2 - y1) / (x2 - x1);
}

function getIntercept(x1, y1, slope) {
  return y1 - slope * x1;
}

function debounce(func, delay = 200) {
  let timeoutId;
  const context = this;
  return (...args) => {
    // cancel the previous timer
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // setup a new timer
    timeoutId = setTimeout(() => {
      func.apply(context, ...args);
    }, delay);
  };
}

export { getRandomDie, getSlope, getIntercept, debounce };
