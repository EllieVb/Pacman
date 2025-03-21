console.log("game.js file is connected!");
import { Pacman } from "./pacman.js";
import {
  DIRECTION_BOTTOM,
  DIRECTION_RIGHT,
  DIRECTION_UP,
  DIRECTION_LEFT,
} from "./pacman.js";

const canvas = document.getElementById("canvas");
export const context = canvas.getContext("2d");
export const pacmanFrames = document.getElementById("animation");

let createRect = (x, y, width, height, color) => {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
};

let fps = 30; //فریم بر ثانیه ای که gameloop بر اساس اون برامون صفحه رو آپدیت میکنه
let pacman;
export let oneBlockSize = 20; //اندازه درنظر گرفته شده برای یک بلاک  در نقشه
let wallColor = "#342DCA";
let wallSpaceWidth = oneBlockSize / 1.4; //اندازه نهایی خطوط در ترسیم دیواره ی نقشه
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2; //اندازه آفست خطوط در ترسیم دیواره ی نقشه
let wallInnerColor = "black";

// 1 => دیوار
// 2 => مسیر حرکت

export let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let createNewPacman = () => {
  pacman = new Pacman(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 5
  );
  console.log("new pacman has successfully created!");
};

let gameLoop = () => {
  update();
  draw();
};

let pacmanCanMove = false;
setTimeout(() => {
  pacmanCanMove = true;
}, 4000); //به بازی تعویق میده که بعد از چند ثانیه شروع بشه

let update = () => {
  // pacman.moveProcess();
  if (pacmanCanMove == true) {
    pacman.moveProcess();
  }
};

let draw = () => {
  createRect(0, 0, canvas.width, canvas.height, "black");
  drawWalls();
  pacman.draw();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let drawWalls = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 1) {
        //مقدار یک برابر با دیوار هست پس باید خطوط دیوار ترسیم بشه
        createRect(
          j * oneBlockSize,
          i * oneBlockSize,
          oneBlockSize,
          oneBlockSize,
          wallColor
        );
        if (j > 0 && map[i][j - 1] == 1) {
          createRect(
            j * oneBlockSize,
            i * oneBlockSize + wallOffset,
            wallSpaceWidth + wallOffset,
            wallSpaceWidth,
            wallInnerColor
          );
        }
        if (j < map[0].length - 1 && map[i][j + 1] == 1) {
          createRect(
            j * oneBlockSize + wallOffset,
            i * oneBlockSize + wallOffset,
            wallSpaceWidth + wallOffset,
            wallSpaceWidth,
            wallInnerColor
          );
        }
        if (i > 0 && map[i - 1][j] == 1) {
          createRect(
            j * oneBlockSize + wallOffset,
            i * oneBlockSize,
            wallSpaceWidth,
            wallSpaceWidth + wallOffset,
            wallInnerColor
          );
        }
        if (i < map.length - 1 && map[i + 1][j] == 1) {
          createRect(
            j * oneBlockSize + wallOffset,
            i * oneBlockSize + wallOffset,
            wallSpaceWidth,
            wallSpaceWidth + wallOffset,
            wallInnerColor
          );
        }
      }
    }
  }
};

createNewPacman();
gameLoop();

window.addEventListener("keydown", (event) => {
  let k = event.keyCode;
  setTimeout(() => {
    if (k == 37 || k == 65) {
      //left
      pacman.nextDirection = DIRECTION_LEFT;
    } else if (k == 38 || k == 87) {
      //up
      pacman.nextDirection = DIRECTION_UP;
    } else if (k == 39 || k == 68) {
      //right
      pacman.nextDirection = DIRECTION_RIGHT;
    } else if (k == 40 || k == 83) {
      //bottom
      pacman.nextDirection = DIRECTION_BOTTOM;
    }
  }, 1);
});
