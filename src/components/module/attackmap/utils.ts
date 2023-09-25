export function getCoordinates(pointId: number, teamLen: number) {
    const numX = Math.ceil(Math.sqrt(teamLen));
    const numY = Math.ceil(teamLen / numX);
  
    const sizeX = 1100 / numX;
    const sizeY = 650 / numY;
  
    const rowNum = Math.floor(pointId / numX);
    const posY = 150 + rowNum * sizeY;
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
    