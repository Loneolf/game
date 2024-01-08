import * as util from '@u/util'
import ArchiveClass from '@u/archiveClass'
import { SNAKEPOSITIONLS } from './config'

export interface IPositionA {
    x: number;
    y: number
}

class Snake implements ArchiveClass {
    snakeA: HTMLDivElement[]
    headEl: HTMLDivElement
    snakeAPositin: IPositionA[]
    oldPostion: IPositionA[]
    constructor() {
        this.snakeA = Array.from(document.querySelectorAll('#snake div')!)
        this.headEl = this.snakeA[0]
        this.snakeAPositin = [{ x: this.X, y: this.Y }]
        this.oldPostion = []
    }

    get X() {
        return util.getRealrem(this.headEl.offsetLeft)
    }
    get Y() {
        return util.getRealrem(this.headEl.offsetTop)
    }

    set X(x: number) {
        if (x === this.X) return
        if (x >= 3 || x < 0) {
            throw new Error("撞墙了，按空格键或者开始按钮重新开始");
        }
        this.moveBody()
        this.isHitSelf(x, this.Y)
        this.headEl.style.left = x + 'rem'
    }

    set Y(y: number) {
        if (y === this.Y) return
        if (y >= 3 || y < 0) {
            throw new Error("撞墙了，按空格键或者开始按钮重新开始");
        }
        this.moveBody()
        this.isHitSelf(this.X, y)
        this.headEl.style.top = y + 'rem'
    }

    // 用户点击暂停进行游行存档，当用户重新打开，先读取存档，没有存档再游戏初始化
    // 使用localStorage进行本地的数据存储
    archive() {
        const position = [
            {x:this.X, y: this.Y},
            ...this.snakeAPositin
        ]
        localStorage.setItem(SNAKEPOSITIONLS, JSON.stringify(position))
    }
    // 当用户点击继续或者读取存档后，清空存档
    clearArchive() {
        localStorage.removeItem(SNAKEPOSITIONLS)
    }

    // 存档还原
    archiveRestore() {
        const positionData:IPositionA[] = JSON.parse(localStorage.getItem(SNAKEPOSITIONLS)!).reverse()
        const head = positionData.pop()!
        this.X = head.x
        this.Y = head.y
        positionData.forEach(item => {
            this.addBody(item)
        })
    }

    addBody(position?: IPositionA) {
        const div = document.createElement('div')
        if (position) {
            div.style.left = `${position.x}rem`
            div.style.top = `${position.y}rem`
        }
        this.snakeA.push(div)
        document.querySelector("#snake")!.appendChild(div)
    }

    // 移动身体
    moveBody() {
        const temPostion = [] as IPositionA[]
        const temOldPostion = [{x: 0, y: 0}] as IPositionA[]
        for (let i = this.snakeA.length - 1; i > 0; i--) {
            const oldx = util.getRealrem(this.snakeA[i].offsetLeft)
            const oldy = util.getRealrem(this.snakeA[i].offsetTop)
            const x = util.getRealrem(this.snakeA[i - 1].offsetLeft)
            const y = util.getRealrem(this.snakeA[i - 1].offsetTop)
            this.snakeA[i].style.left = `${x}rem`
            this.snakeA[i].style.top = `${y}rem`
            temOldPostion.push({x: oldx, y: oldy})
            temPostion.push({x, y})
        }
        this.snakeAPositin = temPostion
        this.oldPostion = temOldPostion
    }

    // 复活重新开始
    init() {
        this.snakeA.forEach((item, index) => {
            if (index === 0) {
                this.headEl.style.left = '0rem'
                this.headEl.style.top = '0rem'
            } else {
                if (index !== 0) item.remove()
            }
        })
        this.snakeA = [this.snakeA[0]]
        this.oldPostion = []
    }

    // 判断是否撞到自己
    isHitSelf(x: number, y: number) {
        this.snakeAPositin.forEach((item) => {
            if (x === item.x && y === item.y) {
                this.backOne()
                throw new Error('撞到了自己')
            }
        })
    }

    // 身体后移一位，撞到自己时，头没有赋值，但是身体已经进行了赋值，所以需要身体后退一步
    backOne() {
        for (let i = this.snakeA.length - 1; i > 0; i--) {
            const item = this.oldPostion[i]
            this.snakeA[i].style.left = `${item.x}rem`
            this.snakeA[i].style.top = `${item.y}rem`
        }
    }
}


export default Snake