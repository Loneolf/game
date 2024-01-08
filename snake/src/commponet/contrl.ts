
import ArchiveClass from '@u/archiveClass'
import Food from './food'
import Score from './score'
import Snake from './snake'
import Music from './music'
import { CONTRLSTATE } from './config'

class Contrl implements ArchiveClass{
    snake: Snake
    score: Score
    food: Food
    music: Music
    isLive: boolean = false
    // 是否暂停游戏
    isStop: boolean = false
    // 是否加速
    isFast: boolean = false
    dirEL: HTMLDivElement
    speedAginEL: HTMLDivElement
    liveOptEL: HTMLDivElement
    // 初始默认向右走
    direction: string = 'right'
    // 所有控制方向的索引
    dirMap: { [dir: string]: string } = {
        '上': 'up', 'ArrowUp': 'up', 'w': 'up',
        '右': 'right', 'ArrowRight': 'right', 'd': 'right',
        '下': 'down', 'ArrowDown': 'down', 's': 'down',
        '左': 'left', 'ArrowLeft': 'left', 'a': 'left',
    }
    // 防止用户连续快速的切换方向将自己撞死，每次切换方向都加上锁，需要蛇前进一格再打开
    isLockDir: boolean = false

    constructor() {
        this.snake = new Snake()
        this.score = new Score()
        this.food = new Food()
        this.music = new Music()
        this.dirEL = document.querySelector('#dirBox')!
        this.dirEL.addEventListener('touchstart', this.clickHandle.bind(this))
        this.dirEL.addEventListener('mousedown', this.clickHandle.bind(this))

        this.liveOptEL = document.querySelector('#agin')!

        // 复活与加速
        this.speedAginEL = document.querySelector('#speedAgin')!
        this.speedAginEL.addEventListener('touchstart', this.touchHandle.bind(this))
        this.speedAginEL.addEventListener('touchend', this.touchHandle.bind(this))
        this.speedAginEL.addEventListener('mousedown', this.touchHandle.bind(this))
        this.speedAginEL.addEventListener('mouseup', this.touchHandle.bind(this))

        // 监听键盘事件，改变方向和复活
        document.addEventListener('keydown', this.keyDownHanle.bind(this))
        document.addEventListener('keyup', this.keyDownHanle.bind(this))
        this.archiveRestore()
    }

    run() {
        if (!this.isLive || this.isStop) return
        let x = this.snake.X
        let y = this.snake.Y
        switch (this.direction) {
            case 'up':
                y -= 0.1
                break
            case 'right':
                x += 0.1
                break
            case 'down':
                y += 0.1
                break
            case 'left':
                x -= 0.1
                break
            default:
                break;
        }
        try {
            this.isEatFoot()
            this.snake.X = Math.round(x * 10) / 10 // 小数精度问题
            this.snake.Y = Math.round(y * 10) / 10
        } catch (error) {
            // console.log('aaaaaa2333', error)
            this.isLive = false
            this.liveOptEL.innerText = '复活'
            this.music.over()
        }

        let time = (300 - this.score.lever * 30) / (this.isFast ? 2 : 1)
        if (time < 60) {
            time = 60
        }
        setTimeout(() => {
            this.run()
            if (this.isLockDir) {
                this.isLockDir = false
            }
        }, time);
    }

    // 判断蛇是否吃到了食物
    isEatFoot() {
        if (this.snake.X === this.food.X && this.snake.Y === this.food.Y) {
            this.food.change(this.snake.snakeAPositin)
            this.snake.addBody()
            this.score.addScore()
            this.music.eatMusic()
        }
    }

    touchHandle(e: TouchEvent | MouseEvent) {
        e.preventDefault()
        const target = e.target as HTMLDivElement
        const inner = target.innerText
        const isPress = e.type === 'touchstart' || e.type === 'mousedown'
        if (inner === '加速') {
            this.isFast = isPress
            this.music.setBgMusicSpeed(isPress ? 1.5 : 1)
        }
        if (!isPress) return
        switch (inner) {
            case '开始':
                this.start(false)
                target.innerText = '暂停'
                break;
            case '暂停':
                this.music.bgMusic.pause()
                target.innerText = '继续'
                this.isStop = true
                this.archive()
                break;
            case '继续':
                // 从存档点击继续，需要两百毫秒后播放音乐， 暂停又开始可以直接播放音乐
                if (!this.isStop) {
                    setTimeout(() => {
                        this.music.init()
                    }, 200);
                } else {
                    this.music.bgMusic.play()
                }
                target.innerText = '暂停'
                this.isStop = false
                this.clearArchive()
                this.run()
                break;
            case '复活':
                this.start()
                target.innerText = '暂停'
                break;
        }
    }

    // 暂停存档
    archive() {
        this.snake.archive()
        this.food.archive()
        this.score.archive()
        localStorage.setItem(CONTRLSTATE, JSON.stringify({ isArchive: true, dir: this.direction }))
    }

    // 点击继续清除存档
    clearArchive() {
        localStorage.removeItem(CONTRLSTATE)
        this.snake.clearArchive()
        this.food.clearArchive()
        this.score.clearArchive()
    }

    // 初始化读取本地是否有存档，如果有存档，则进行存档还原和清档
    archiveRestore() {
        try {
            const archiveData: { isArchive: boolean, dir: string } = JSON.parse(localStorage.getItem(CONTRLSTATE)!)
            if (archiveData?.isArchive) {
                this.liveOptEL.innerText = '继续'
                this.direction = archiveData.dir
                this.isLive = true
                this.snake.archiveRestore()
                this.food.archiveRestore()
                this.score.archiveRestore()
            }
        } catch (error) {
            console.log('存档异常')
            // this.start()
        }

    }


    clickHandle(e: TouchEvent | MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        const target = e.target as HTMLDivElement
        if (this.dirMap[target.innerText]) {
            this.setDir(this.dirMap[target.innerText])
        }
    }

    // 处理键盘事件，方向赋值，空格复活，K键加速
    keyDownHanle(e: KeyboardEvent) {
        if (e.type === 'keyup' && e.key !== 'k') return
        if (e.key === 'k') {
            this.isFast = e.type === 'keydown'
            this.music.setBgMusicSpeed(e.type === 'keydown' ? 1.5 : 1)
        }
        // 空格键复活重新开始
        if (e.code === 'Space') {
            this.start(false)
            this.liveOptEL.innerText = '暂停'
        }
        if (this.dirMap[e.key]) {
            this.setDir(this.dirMap[e.key])
        }
    }

    setDir(dir: string) {
        // 相反方向映射
        const backDir: { [dir: string]: string } = {
            up: 'down',
            down: 'up',
            right: 'left',
            left: 'right'
        }
        if (dir === backDir[this.direction] || this.isLockDir) {
            return
        }
        this.isLockDir = true
        this.direction = dir
    }

    start(changeFood = true) {
        if (this.isLive) return
        this.snake.init()
        this.score.init()
        this.music.init()
        this.isLive = true
        this.direction = 'right'
        this.isFast = false
        changeFood && this.food.change()
        this.run()
    }

}


export default Contrl