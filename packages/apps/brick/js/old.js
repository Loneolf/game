// 版本一：面向过程不分离写
var __main = function(){
    let canvas = document.querySelector('#myCanvas')
    let context = canvas.getContext('2d')

    let leftDown = false
    let rightDown = false

    let left = 100
    let myTop = 200
    let speed = 5
    let img = new Image()
    img.src = './img/board.png'
    img.onload = function(){
      context.drawImage(img,left,myTop)
    }

    window.addEventListener('keydown',(e)=>{
      if(e.key === 'd' || e.key === 'ArrowRight'){
        leftDown = true
      } else if(e.key === 'a' || e.key === 'ArrowLeft'){
        rightDown = true
      }
    })

    window.addEventListener('keyup',(e)=>{
      if(e.key === 'd' || e.key === 'ArrowRight'){
        leftDown = false
      } else if(e.key === 'a' || e.key === 'ArrowLeft'){
        rightDown = false
      }
    })
    setInterval(()=>{
      if(leftDown){
        left += speed
        context.clearRect(0,0,canvas.width,canvas.height); 
        context.drawImage(img,left,myTop)
      }else if(rightDown){
        left -= speed
        context.clearRect(0,0,canvas.width,canvas.height); 
        context.drawImage(img,left,myTop)
      }
    },1000/60)
  }
  __main()