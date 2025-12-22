let imgData=(function () {
    return [
        {
            "filename": "0",
            "frame": {"x":400,"y":78,"w":28,"h":39}
        },
        {
            "filename": "0",
            "frame": {"x":368,"y":140,"w":28,"h":39}
        },
        {
            "filename": "1",
            "frame": {"x":368,"y":181,"w":28,"h":39}
        },
        {
            "filename": "2",
            "frame": {"x":400,"y":119,"w":28,"h":39}
        },
        {
            "filename": "3",
            "frame": {"x":398,"y":160,"w":28,"h":39}
        },
        {
            "filename": "4",
            "frame": {"x":398,"y":201,"w":28,"h":39}
        },
        {
            "filename": "5",
            "frame": {"x":428,"y":160,"w":28,"h":39}
        },
        {
            "filename": "6",
            "frame": {"x":428,"y":201,"w":28,"h":39}
        },
        {
            "filename": "7",
            "frame": {"x":430,"y":78,"w":28,"h":39}
        },
        {
            "filename": "8",
            "frame": {"x":430,"y":119,"w":28,"h":39}
        },
        {
            "filename": "9",
            "frame": {"x":460,"y":75,"w":28,"h":39}
        },
        {
            "filename": "banner",
            "frame": {"x":1,"y":217,"w":343,"h":14}
        },
        {
            "filename": "bird0",
            "frame": {"x":460,"y":147,"w":40,"h":26}
        },
        {
            "filename": "bird1",
            "frame": {"x":458,"y":175,"w":40,"h":26}
        },
        {
            "filename": "down_bird0",
            "frame": {"x":326,"y":140,"w":40,"h":30}
        },
        {
            "filename": "down_bird1",
            "frame": {"x":457,"y":43,"w":39,"h":30}
        },
        {
            "filename": "down_mod",
            "frame": {"x":370,"y":74,"w":59,"h":2}
        },
        {
            "filename": "down_pipe",
            "frame": {"x":272,"y":78,"w":62,"h":60}
        },
        {
            "filename": "game_over",
            "frame": {"x":272,"y":1,"w":221,"h":40}
        },
        {
            "filename": "head",
            "frame": {"x":1,"y":138,"w":236,"h":77}
        },
        {
            "filename": "message",
            "frame": {"x":1,"y":1,"w":269,"h":135}
        },
        {
            "filename": "ok",
            "frame": {"x":272,"y":43,"w":96,"h":33}
        },
        {
            "filename": "score",
            "frame": {"x":370,"y":43,"w":85,"h":29}
        },
        {
            "filename": "start",
            "frame": {"x":239,"y":140,"w":85,"h":29}
        },
        {
            "filename": "submit",
            "frame": {"x":239,"y":171,"w":85,"h":29}
        },
        {
            "filename": "up_bird0",
            "frame": {"x":326,"y":172,"w":40,"h":29}
        },
        {
            "filename": "up_bird1",
            "frame": {"x":460,"y":116,"w":40,"h":29}
        },
        {
            "filename": "up_mod",
            "frame": {"x":1,"y":233,"w":59,"h":3}
        },
        {
            "filename": "up_pipe",
            "frame": {"x":336,"y":78,"w":62,"h":60}
        }]
})();

class RES{
    static getImg(imgName){
        let imgDiv=document.createElement("div");
       let arr=imgData.filter(function (item) {
           return item.filename===imgName
        });
       if(arr.length===0) return imgDiv;
       let itemData=arr[0];
        imgDiv.className=itemData.filename;
        imgDiv.w=itemData.frame.w;
        imgDiv.h=itemData.frame.h;
        Object.assign(imgDiv.style,{
            width:itemData.frame.w+"px",
            height:itemData.frame.h+"px",
            backgroundImage:`url(img/bird.png)`,
            backgroundPositionX:-itemData.frame.x+"px",
            backgroundPositionY:-itemData.frame.y+"px",
            position:"absolute"
        });
        return imgDiv;
    }
    static changeImg(elem,name){
        let arr=imgData.filter(function (item) {
            return item.filename===name
        });
        if(arr.length===0) return;
        let itemData=arr[0];
        elem.className=itemData.filename;
        Object.assign(elem.style,{
            width:itemData.frame.w+"px",
            height:itemData.frame.h+"px",
            backgroundImage:`url(img/bird.png)`,
            backgroundPositionX:-itemData.frame.x+"px",
            backgroundPositionY:-itemData.frame.y+"px",
            position:"absolute"
        });
    }
    static moveDiv(elem,x=0,y=0){
        if(!elem)return;
        Object.assign(elem.style,{
            left:x+"px",
            top:y+"px"
        })
    }
}
/*
*  小鸟类
*  1、设置状态
*  2、修改状态
*  3、创建小鸟
*  4、更新---小鸟飞
*  5、小鸟飞
*
*
*
* */
class Bird{
    /*
    * 当写constructor时，这就是构造函数
    * 这个函数，当时用new时，自动执行（new Bird()）就会执行这个函数
    * 1、三种状态：默认状态，up状态，down状态
    * 2、初始化为默认状态
    * 3、设置三个数组，分别存放不同的状态调用的图片列表
    * 4、设置num为当前需要调用的数组中对应的项
    * 5、设置间隔时间time=10；
    * 6、创建小鸟
    *
    * */
    constructor(parent,moveBool,speed=1){
        Bird.NORMAL_STATUS="normal_status";
        Bird.UP_STATUS="up_status";
        Bird.DOWN_STATUS="down_status";
        this.status=Bird.NORMAL_STATUS;
        this.normalList=["bird0","bird1"];
        this.upList=["up_bird0","up_bird1"];
        this.downList=["down_bird0","down_bird1"];
        this.num=0;
        this.time=10;
        this.speed=speed;
        this.moveBool=moveBool;
        this.createBird(parent);

    }

    clickHandler(){
        this.speed=-3;
    }
    /*
    *  修改状态，如果修改状态后，
    *  设置当前的状态为指定状态
    *  设置当前调用图片的序列项回到第0项
    *
    * */
    changeStatus(_status){
        this.status=_status;
        this.num=0;
    }
    /*
    *  创建小鸟
    *  这里的小鸟每个对象仅允许创建一次
    *  将小鸟放在父容器中
    *
    * */
    createBird(parent){
        if(!this.birdImg){
            this.birdImg=RES.getImg("bird0");
            this.birdImg.style.zIndex=10;
        }
        parent.appendChild(this.birdImg);
        return this.birdImg;
    }
    /*
    * 每次更新时，执行birdFly这个函数
    *
    * */
    update(){
        this.birdFly();
        this.birdMove();
    }
    /*
    * 每次都会执行birdFly
    * 1、修改间隔执行次数
    * 2、设置num增加
    * 3、根据当前状态是第几个，调用不同图片序列，如果num超出了就回到0
    * 4、根据图片名称，修改当前小鸟的图片背景
    * */
    birdFly(){
        this.time--;
        if(this.time>0)return;
        this.time=10;
        this.num++;
        let name="";
        switch (this.status){
            case Bird.NORMAL_STATUS:
                if(this.num>this.normalList.length-1) this.num=0;
                name=this.normalList[this.num];
                break;
            case Bird.UP_STATUS:
                if(this.num>this.upList.length-1) this.num=0;
                name=this.upList[this.num];
                break;
            case Bird.DOWN_STATUS:
                if(this.num>this.downList.length-1) this.num=0;
                name=this.downList[this.num];
                break;
        }

        RES.changeImg(this.birdImg,name);
    }
    /*
    *
    * */
    birdMove(){
        if(!this.moveBool)return;
        if(this.speed>0 && this.status!==Bird.DOWN_STATUS){
            this.changeStatus(Bird.DOWN_STATUS);
        }else if(this.speed<0 && this.status!==Bird.UP_STATUS){
            this.changeStatus(Bird.UP_STATUS);
        }
        this.speed+=0.1;
        this.birdImg.style.top=this.birdImg.offsetTop+this.speed+"px";
        if(this.birdImg.offsetTop>this.birdImg.parentElement.parentElement.clientHeight-this.birdImg.clientHeight){
           this.birdImg.parentElement.dispatchEvent(new Event(GameRun.EVENT_ID))
        }
    }
}

class Pipe{
    constructor(parent,spaceHeight,speed=1){
        this.speed=speed;
        this.createPipe(parent,spaceHeight);
    }
    createPipe(parent,spaceHeight){
        let upHead=RES.getImg("up_pipe");
        let downHead=RES.getImg("down_pipe");

        this.upPipe=this.createPipeDiv("up_mod",upHead.w);
        this.upPipe.appendChild(upHead);
        this.downPipe=this.createPipeDiv("down_mod",downHead.w);
        this.downPipe.appendChild(downHead);
        Object.assign(upHead.style,{
            position:"absolute",
            bottom:0
        });
        Object.assign(downHead.style,{
            position:"absolute",
            top:0
        });
        let heightSum=423-spaceHeight;
        let upRandomHeight=this.random(upHead.h,heightSum-downHead.h);

        parent.appendChild(this.upPipe);
        parent.appendChild(this.downPipe);
        Object.assign(this.upPipe.style,{
            height:upRandomHeight+"px",
            top:0,
            left:"344px"
        });
        Object.assign(this.downPipe.style,{
            height:heightSum-upRandomHeight+"px",
            top:423-heightSum+upRandomHeight+"px",
            left:"344px"
        });


    }
    createPipeDiv(name,w){
        let div=document.createElement("div");
        Object.assign(div.style,{
            backgroundImage:`url(img/${name}.png)`,
            position:"absolute",
            width:w+"px"
        });
        return div;
    }
    random(min,max){
        if(min>max) [max,min]=[min,max];
        return Math.floor(Math.random()*(max-min)+min);
    }
    dispose(){
        this.upPipe.remove();
        this.downPipe.remove();
        this.upPipe=null;
        this.downPipe=null;
    }
    update(){
        if(!this.upPipe || !this.downPipe) return;
        this.upPipe.style.left=this.upPipe.offsetLeft-this.speed+"px";
        this.downPipe.style.left=this.downPipe.offsetLeft-this.speed+"px";
        if(this.upPipe.offsetLeft+this.upPipe.offsetWidth<0){
            this.upPipe.remove();
            this.downPipe.remove();
            this.upPipe=null;
            this.downPipe=null;
        }
    }
}

class Grass{
    constructor(parent,speed=1){
        this.speed=speed;
        this.grassView=this.createGrass(parent);
    }
    createGrass(parent){
        let div=document.createElement("div");
        for(let i=0;i<2;i++) {
            let img = RES.getImg("banner");
            div.appendChild(img);
            RES.moveDiv(img, img.w * i, 423);
        }
        parent.appendChild(div);
        return div;
    }
    update(){
        for(let i=0;i<this.grassView.children.length;i++){
            this.grassView.children[i].style.left=this.grassView.children[i].offsetLeft-this.speed+"px";
            if(this.grassView.children[i].offsetLeft<-this.grassView.children[i].w){
                RES.moveDiv(this.grassView.children[i], this.grassView.children[i].w , 423);
            }
        }

    }

}

class Score{
    constructor(parent){
        this.list=[];
        this.createScore(parent)
    }
    createScore(parent){
        this.list.push(RES.getImg(""));
        this.list.push(RES.getImg(""));
        this.list.push(RES.getImg("0"));
        for(let i=0;i<this.list.length;i++){
            parent.appendChild(this.list[i]);
            Object.assign(this.list[i].style,{
                position:"static",
                float:"left"
            });

        }
    }
    changeScore(num){
        if(num>=1000)return;
        let arr=(num.toString()).split("").reverse();
        for(let j=arr.length;j<3;j++){
            arr.push("");
        }
        arr.reverse();
        for(let i=0;i<arr.length;i++){
            RES.changeImg(this.list[i],arr[i]);
            Object.assign(this.list[i].style,{
                position:"static",
                float:"left"
            });
        }
    }
}

class GameStart{
    constructor(){
        GameStart.EVENT_ID="gameStart_eventId";
        this.view=null;
    }
    /*
    *  单例模式
    *  有时候我们处理的内容需要是一个对象，并且这个对象有相关联的方法
    *  而我们不希望大量使用静态方法时，就可以使用单例模式将当前的这个
    *  对象唯一化，然后仅处理当前对象，就可以实现类似于静态方法的特征
    *  单例后，代码中的动态方法可以使用this
    * */
   static getInstance(){
        if(!GameStart.instance){
            GameStart.instance=new GameStart();
        }
        return GameStart.instance;
    }
    createGameView(){
       let div=document.createElement("div");
       let head=RES.getImg("head");
        div.appendChild(head);
        RES.moveDiv(head,65,100);
       /* Object.assign(head.style,{
            top:"100px",
           left:"65px"
        });*/
        this.bird=new Bird(div);
        RES.moveDiv(this.bird.birdImg,210,100);
        /*Object.assign(this.bird.birdImg.style,{
            left:"210px",
            top:"100px"
        });*/
        let startBn=RES.getImg("start");
        div.appendChild(startBn);
        startBn.addEventListener("click",this.startClickHandler);
       /* Object.assign(startBn.style,{
            left:"50px",
            top:"250px"
        });*/
       RES.moveDiv(startBn,50,250);
       let scoreBn=RES.getImg("score");
       RES.moveDiv(scoreBn,200,250);
        scoreBn.addEventListener("click",this.scoreClickHandler);
        div.appendChild(scoreBn);
       return div;
    }
    //在这里我们不要直接针对父容器做修改，而使用抛发事件的方式告诉父容器你该做什么了
    startClickHandler(e){
        this.parentElement.dispatchEvent(new Event(GameStart.EVENT_ID));
    }
    scoreClickHandler(e){

    }
    add(parent){
        if(!this.view){
            this.view=this.createGameView();
        }
        parent.appendChild(this.view);
    }
    remove(){
        if(!this.view)return;
        this.view.remove();
    }
    update(){
        //如果gameStart对应这个显示div的父容器不存在，就不在更新这个容器中的所有内容
        if(!this.view || !this.view.parentElement)return;
        if(this.bird){
            this.bird.update();
        }
    }
}

class GameRun{
    constructor(){
        GameRun.EVENT_ID="gameRun_eventId";
        this.bool=true;
        this.pipeList=[];
        this.time=0;
        this.initHeight=200;
        this.lv=1;
        this.view=null;
    }
    /*
    *
    *  继承后,静态的属性会直接赋值给该类，并且如果使用了单例
    *  尽量不要使用继承
    * */
    static getInstance(){
        if(!GameRun.instance){
            GameRun.instance=new GameRun();
        }
        return GameRun.instance;
    }
    createGameView(){
        let div=document.createElement("div");
        this.grass=new Grass(div);
        this.bird=new Bird(div,true);

        document.addEventListener("click",this.clickHandler);
        return div;
    }


    clickHandler(e){
        if(!GameRun.getInstance().bool) return;
        GameRun.getInstance().bird.clickHandler();
    }
    add(parent){
        if(!this.view){
            this.view=this.createGameView();
        }
        Object.assign(this.view.style,{
            width:parent.offsetWidth+"px",
            height:parent.offsetHeight+"px",
            position:"absolute",
            overflow:"hidden"
        });
        RES.moveDiv(this.bird.birdImg,30,250);
        this.bool=true;
        parent.appendChild(this.view);
    }
    remove(){
        if(!this.view || !this.view.parentElement)return;
        for(let i=0;i<this.pipeList.length;i++){
            this.pipeList[i].dispose();
            this.pipeList[i]=null;
        }
        this.pipeList.length=0;
        this.time=0;
        this.lv=1;
        this.view.remove();
    }
    update(){
        if(!this.view || !this.view.parentElement)return;
        if(this.bird){
            this.bird.update();
            if(this.bird.birdImg.offsetTop<0){
                this.bool=false;
            }
        }
        if(!this.bool) return;
        if(this.grass){
            this.grass.update();
        }
        this.createPipe();
        this.updatePipe();

    }
    createPipe() {
        if(!this.view)return;
        this.time--;
        if (this.time > 0) return;
        this.time=300-this.lv*50;
        if(this.time<20) this.time=20;
        this.pipeList.push(new Pipe(this.view,this.initHeight-this.lv*15,this.lv));
    }

    updatePipe(){
        if(this.pipeList.length===0) return;
        let arr=[];
        for(let i=0;i<this.pipeList.length;i++){
            this.pipeList[i].update();
            if(!this.pipeList[i].upPipe){
                this.pipeList[i]=null;
            }else{
                arr.push(this.pipeList[i]);
                if(!this.bird) continue;
                if(GameRun.hitTest(this.bird.birdImg,this.pipeList[i].upPipe) || GameRun.hitTest(this.bird.birdImg,this.pipeList[i].downPipe)){
                    this.bool=false;
                }
            }
        }
        this.pipeList=arr.concat();
        arr=null;
    }
    static hitTest(elem1,elem2){

        let rect1=elem1.getBoundingClientRect();
        let rect2=elem2.getBoundingClientRect();
        if(rect1.left>rect2.left && rect1.left<rect2.right && rect1.top>rect2.top && rect1.top<rect2.bottom){
            return true;
        }
        if(rect1.right>rect2.left && rect1.right<rect2.right && rect1.top>rect2.top && rect1.top<rect2.bottom){
                return true;
        }
        if(rect1.left>rect2.left && rect1.left<rect2.right && rect1.bottom>rect2.top && rect1.bottom<rect2.bottom){
            return true;
        }
        if(rect1.right>rect2.left && rect1.right<rect2.right && rect1.bottom>rect2.top && rect1.bottom<rect2.bottom){
            return true;
        }
        return false;
    }


}

class GameOver{
    constructor(){
        GameOver.EVENT_ID="gameOver_eventId";
        this.view=null;
    }
    static getInstance(){
        if(!GameOver.instance){
            GameOver.instance=new GameOver();
        }
        return GameOver.instance;
    }
    createGameView(){
        let div=document.createElement("div");
        let img=RES.getImg("game_over");
        div.appendChild(img);
        RES.moveDiv(img,65,100);
        let okBn=RES.getImg("ok");
        div.appendChild(okBn);
        okBn.addEventListener("click",this.clickHandler);
        RES.moveDiv(okBn,125,255);
        this.integral=RES.getImg("0");
        div.appendChild(this.integral);
        RES.moveDiv(this.integral,157,20);
        return div;
    }
    clickHandler(e){
        this.parentElement.dispatchEvent(new Event(GameOver.EVENT_ID))
    }
    setIntegral(value){

    }
    add(parent){
        if(!this.view){
            this.view=this.createGameView();
        }
        parent.appendChild(this.view);
    }
    remove(){
        if(!this.view)return;
        this.view.remove();
    }

}
/*
*   静态方法和动态方法
*   静态方法通常仅对于类起作用
*   动态方法对于new出对象起作用
*
*   静态一般作用为仅对于创建一次元素，或者仅按照对应数据执行一次内容，
*   不产生相关联数据的信息，并且不保存时，使用静态方法。静态方法不需要
*   实例对象（不需要new），因此该方法也会常驻内存中，不能使用this
*
*
*
*   动态方法，需要创建多个相类似的对象，并且各自有不同的数据，通过同样的
*   方法处理不同的对象内容，必须建立在实例的对象的基础上才能够使用动态方法
*   因此要想使用必须创建对象（需要new）
*
* */
class Game{
    static init(){
        Game.GAME_START="game_Start";
        Game.GAME_RUN="game_Run";
        Game.GAME_OVER="game_over";
        Game.gameView=Game.getGameView(document.body);
        Game.gameStatus(Game.GAME_RUN);


        Game.animation();
    }
    static getGameView(parent){
       let div=document.createElement("div");
       Object.assign(div.style,{
           width:"343px",
           height:"480px",
           margin:"auto",
           backgroundImage:"url(img/bg.jpg)",
           position:"relative"
       });
        parent.appendChild(div);
       return div;
    }
    static gameStatus(status){
        switch (status){
            case Game.GAME_START:
                GameStart.getInstance().add(Game.gameView);
                GameStart.getInstance().view.addEventListener(GameStart.EVENT_ID,Game.changeStatusHandler);
                break;
            case Game.GAME_RUN:
                GameRun.getInstance().add(Game.gameView);
                GameRun.getInstance().view.addEventListener(GameRun.EVENT_ID,Game.changeStatusHandler);
                break;
            case Game.GAME_OVER:
                GameOver.getInstance().add(Game.gameView);
                GameOver.getInstance().view.addEventListener(GameOver.EVENT_ID,Game.changeStatusHandler);
                break;
        }
    }

    static changeStatusHandler(e){

        switch (e.type){
            case GameStart.EVENT_ID:
                GameStart.getInstance().view.removeEventListener(GameStart.EVENT_ID,Game.changeStatusHandler);
                GameStart.getInstance().remove();
                Game.gameStatus(Game.GAME_RUN);
                break;
            case GameRun.EVENT_ID:

                GameRun.getInstance().view.removeEventListener(GameRun.EVENT_ID,Game.changeStatusHandler);
                GameRun.getInstance().remove();
                Game.gameStatus(Game.GAME_OVER);
                break;
            case GameOver.EVENT_ID:
                GameOver.getInstance().view.removeEventListener(GameOver.EVENT_ID,Game.changeStatusHandler);
                GameOver.getInstance().remove();
                Game.gameStatus(Game.GAME_START);
                break;
        }

    }
    static animation(){
        requestAnimationFrame(Game.animation);
        GameStart.getInstance().update();
        GameRun.getInstance().update();
    }
}