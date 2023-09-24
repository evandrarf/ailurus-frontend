export function parseJwt<T>(token: string): T | null {
  try {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
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
