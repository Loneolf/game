export default function MyGame() {
    let canvas = document.querySelector("#myCanvas");
    let context = canvas.getContext("2d");
    let g = {
      canvas,
      context,
      actions: {},
      keydowns: {},
    };
    g.draw = function (gameImage) {
      g.context.drawImage(gameImage.image, gameImage.x, gameImage.y);
    };
    window.addEventListener("keydown", (e) => g.keydowns[e.key] = true );
    window.addEventListener("keyup", (e) => g.keydowns[e.key] = false );
    g.registerAction = function (key, callBack) {
      if (Array.isArray(key)) {
        for (let i = 0; i < key.length; i++) {
          g.actions[key[i]] = callBack;
        }
      } else {
        g.actions[key] = callBack;
      }
    };
  
    //递归调用
    g.runLoop = function() {
      for (const key in g.actions) {
        if (g.keydowns[key]) g.actions[key]();
      }
      g.updata();
      g.context.clearRect(0, 0, g.canvas.width, g.canvas.height);
      g.drag();
      setTimeout(() => {
        g.runLoop()
      }, 1000 / window.fps);
    }
    return g;
  }