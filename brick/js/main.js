import {crash, levels} from "./util.js";
import MyGame from './game.js'
import Brick from './brick.js'
import Board from './board.js'
import Bullet from "./bullet.js";

let bricks = []
window.fps = 30

__main();
function __main() {
  enableDebug(true)
  let myGame = MyGame();
  let board = Board();
  let bullet = Bullet();
  for (let i = 0; i < 3; i++) {
    bricks.push(Brick([i * 100, 100]));
  }

  myGame.registerAction(["a", "ArrowLeft"], () => board.moveLeft());
  myGame.registerAction(["d", "ArrowRight"], () => board.moveRight());
  myGame.registerAction("f", () => bullet.fire());
  myGame.registerAction("s", () => bullet.stop());
  myGame.updata = function () {
    log('aaa', 30)
    bullet.move();
    if (crash(bullet, board)) bullet.changeDirectionY();
    for (let i = 0; i < bricks.length; i++) {
      if (bricks[i].alive && crash(bullet, bricks[i])) {
        bullet.changeDirectionY();
        bricks[i].kill();
      }
    }
  };
  myGame.drag = function () {
    myGame.draw(board);
    myGame.draw(bullet);
    for (let j = 0; j < bricks.length; j++) {
      if (bricks[j].alive) myGame.draw(bricks[j]);
    }
  };
  myGame.runLoop()
}

function enableDebug(enable) {
  if (!enable) return
  let input = document.querySelector('.input')
  input.addEventListener('input', (e)=> {
    window.fps = Number(e.target.value)
  })
  window.addEventListener('keydown', (e)=> {
    if ('1234'.includes(e.key)) {
      bricks = loadLevel(levels[e.key])
    }
  })
}

function loadLevel(level) {
  let bricks = []
  for (let i = 0; i < level.length; i++) {
    bricks.push(Brick(level[i]))
  }
  return bricks
}