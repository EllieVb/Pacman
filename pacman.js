console.log("pacman.js file is connected!");
import { map, context, pacman, oneBlockSize, pacmanFrames } from "./game.js";

export const DIRECTION_RIGHT = 4;
export const DIRECTION_UP = 3;
export const DIRECTION_LEFT = 2;
export const DIRECTION_BOTTOM = 1;

export class Pacman {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = DIRECTION_RIGHT; //جهت حرکت پکمن به صورت پیش فرض به سمت راست هست
    this.nextDirection = this.direction; //مسیر حرکت جدید رو بعد از ایونت دکمه میده
    this.currentFrame = 1; //فریم نمایشی پیش فرض و اولیه ی پکمن در گیف، اولی هست
    this.frameCount = 7; //تعداد کل فریم های حرکت پکمن در گیف
    this.lastTeleportTime = 0;

    setInterval(() => {
      this.changeAnimation();
    }, 100);
  }

  //کل رفتارهای حرکتی پکمن به شرح زیر
  moveProcess() {
    this.changeDirectionIfPossible();
    this.moveForwards();
    if (this.checkCollision()) {
      this.moveBackwards();
    }
    this.checkTeleport(); //000000000000000000000000000000000000000000000000000000000000000000000000000000 teleport function
  }
  eat() {}
  moveBackwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x -= this.speed;
        break;
      case DIRECTION_UP:
        this.y += this.speed;
        break;
      case DIRECTION_LEFT:
        this.x += this.speed;
        break;
      case DIRECTION_BOTTOM:
        this.y -= this.speed;
        break;
    }
  }
  moveForwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x += this.speed;
        break;
      case DIRECTION_UP:
        this.y -= this.speed;
        break;
      case DIRECTION_LEFT:
        this.x -= this.speed;
        break;
      case DIRECTION_BOTTOM:
        this.y += this.speed;
        break;
    }
  }

  teleport(newX, newY) {
    pacman.disappeared = true;
    setTimeout(() => {
      this.x = newX * oneBlockSize;
      this.y = newY * oneBlockSize;
      pacman.disappeared = false;
    }, 3);
    console.log("teleporting pacman to new location");
  } //0000000000000000000000000000000000000000000000000000000000000000000000000000000 teleport function

  checkCollision() {
    if (
      map[this.getMapY()][this.getMapX()] == 1 ||
      map[this.getMapYRightSide()][this.getMapX()] == 1 ||
      map[this.getMapY()][this.getMapXRightSide()] == 1 ||
      map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
      //موقعیت های احتمالی برخورد پکمن با دیوار ها که مقدار 1 رو در نقشه دارند
    ) {
      return true;
    }
    return false;
  }

  checkTeleport() {
    let pacX = this.getMapX();
    let pacY = this.getMapY();

    let currentTime = Date.now();
    if (currentTime - this.lastTeleportTime < 500) return;

    if (map[pacY][pacX] === 4) {
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
          if (map[row][col] === 5) {
            this.teleport(col, row);
            this.lastTeleportTime = currentTime;
            return;
          }
        }
      }
    } else if (map[pacY][pacX] === 5) {
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
          if (map[row][col] === 4) {
            this.teleport(col, row);
            this.lastTeleportTime = currentTime;
            return;
          }
        }
      }
    }
  } //000000000000000000000000000000000000000000000000000000000000000000000000000 teleport function

  checkGhostCollision() {}
  changeDirectionIfPossible() {
    if (this.direction == this.nextDirection) return;

    let tempDirection = this.direction;
    this.direction = this.nextDirection;
    this.moveForwards();
    if (this.checkCollision()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }
  changeAnimation() {
    this.currentFrame =
      this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
  }

  draw() {
    context.save();
    context.translate(this.x + oneBlockSize / 2, this.y + oneBlockSize / 2);
    context.rotate((this.direction * 90 * Math.PI) / 180);

    context.translate(-this.x - oneBlockSize / 2, -this.y - oneBlockSize / 2);

    context.drawImage(
      pacmanFrames,
      (this.currentFrame - 1) * oneBlockSize,
      0,
      oneBlockSize,
      oneBlockSize,
      this.x,
      this.y,
      this.width,
      this.height
    );

    context.restore();
  }
  getMapX() {
    return parseInt(this.x / oneBlockSize);
  }
  getMapY() {
    return parseInt(this.y / oneBlockSize);
  }
  getMapXRightSide() {
    return parseInt((this.x + 0.9999 * oneBlockSize) / oneBlockSize);
  }
  getMapYRightSide() {
    return parseInt((this.y + 0.9999 * oneBlockSize) / oneBlockSize);
  }
}
