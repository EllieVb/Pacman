console.log("pacman.js file is connected!");
import { map, context, oneBlockSize, pacmanFrames } from "./game.js";

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
