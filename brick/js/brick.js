import { imgFromPath } from './util.js'

export default function Brick(p) {
    let img = imgFromPath("./img/brick.png");
    let b = {
      image: img,
      x: p[0],
      y: p[1],
      life: p[2] || 1,
      alive: true,
    };
    b.kill = function () {
      this.life--
      if (this.life < 1) this.alive = false;
    };
    return b;
  }