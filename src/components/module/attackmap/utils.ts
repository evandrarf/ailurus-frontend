export function getCoordinates(pointId: number, teamLen: number) {
  const numX = Math.ceil(Math.sqrt(teamLen));
  const numY = Math.ceil(teamLen / numX);

  const sizeX = 1100 / numX;
  const sizeY = 650 / numY;

  const rowNum = Math.floor(pointId / numX);
  const posY = 100 + rowNum * sizeY;
  var posX = 100 + (pointId % numX) * sizeX;
  if (rowNum % 2 == 1) {
    posX += sizeX / 2;
  }
  return { posX, posY };
}

// Taken from https://github.com/qeeqbox/raven/blob/main/src/scripts/raven.js#L764C3-L771C4
export function randomColor() {
  const color_array = [0, Math.floor(Math.random() * 256), 255];
  for (let i = color_array.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [color_array[i], color_array[rand]] = [color_array[rand], color_array[i]];
  }
  return "#" + color_array.map((c) => c.toString(16).padStart(2, "0")).join("");
}

interface Point {
  x: number;
  y: number;
}

export function generateControlPoints(P0: Point, P3: Point) {
  // Calculate the difference between start and end points
  const deltaX = Math.abs(P3.x - P0.x);
  var deltaY = Math.abs(P3.y - P0.y);

  // Define factors for controlling the shape of the curve
  var factor1 = 0.3; // Adjust this factor for different curves
  var factor2 = 0.7; // Adjust this factor for different curves
  var factorX = 0;

  if (deltaY == 0) {
    deltaY = deltaX * 0.5;
    factor2 = factor1;
  }
  if (deltaX == 0) factorX = 30;
  // Calculate control points based on the factors
  const P1: Point = {
    x: P0.x,
    y: P0.y - factor1 * deltaY,
  };

  const P2: Point = {
    x: P3.x - factorX,
    y: P3.y - factor2 * deltaY,
  };

  return { P1, P2 };
}
