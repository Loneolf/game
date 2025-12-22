import { imgFromPath } from './util.js'

export default function Board() {
    let img = imgFromPath("./img/board.png");
    let board = {
      image: img,
      x: 100,
      y: 280,
      speed: 10,
    };
    board.moveLeft = function () {
      this.x -= this.speed;
      if (this.x < 0) this.x = 0;
    };
    board.moveRight = function () {
      this.x += this.speed;
      let tem = 400 - this.image.width;
      if (this.x > tem) this.x = tem;
    };
    return board;
  }