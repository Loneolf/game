import { imgFromPath } from './util.js'

export default function Bullet() {
    let img = imgFromPath("./img/bullet.png");
    let bullet = {
      image: img,
      x: 100,
      y: 240,
      speedX: -4,
      speedY: -4,
      fired: false,
      fire() {
        bullet.fired = true;
      },
      stop() {
        bullet.fired = false;
      },
      changeDirectionX() {
        this.speedX = -this.speedX;
      },
      changeDirectionY() {
        this.speedY = -this.speedY;
      },
    };
  
    bullet.move = function () {
      if (!bullet.fired) return;
      if (bullet.x <= 0 || bullet.x + bullet.image.width >= 400)
        this.changeDirectionX();
      if (bullet.y <= 0 || bullet.y + bullet.image.height >= 300)
        this.changeDirectionY();
      if (bullet.x >= 0 && bullet.x <= 400) {
        bullet.x += bullet.speedX;
      }
      if (bullet.y >= 0 && bullet.y <= 300) {
        bullet.y += bullet.speedY;
      }
    };
    return bullet;
  }