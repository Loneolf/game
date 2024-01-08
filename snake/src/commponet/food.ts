import * as util from '@u/util'
import ArchiveClass from '@u/archiveClass'
import { IPositionA } from './snake'
import { FOODPOSITIONLS } from './config'

class Food implements ArchiveClass {

    foodEl: HTMLDivElement;

    constructor() {
        this.foodEl = document.querySelector('#food')!
        this.change()
    }

    get X(): number {
        return util.getRealrem(this.foodEl.offsetLeft)
    }

    get Y(): number {
        return util.getRealrem(this.foodEl.offsetTop)
    }

    set X(x: number) {
        this.foodEl.style.left = x + 'rem'
    }

    set Y(y: number){
        this.foodEl.style.top = y + 'rem'
    }

    // 食物不能更改在蛇身上，需要传递过来蛇的坐标，不传的话默认不在蛇的初始位置
    change(postion?: IPositionA[]) {
        let x = Math.floor(Math.random() * 30) / 10 
        let y = Math.floor(Math.random() * 30) / 10 
        if (this.X === x && this.Y === y || (!postion && x === 0 && y === 0)) {
            this.change()
            return
        } 
        const hasSome = postion?.some((item => {
            return item.x === x && item.y === y
        }))
        if (hasSome) {
            this.change()
            return
        }
        this.X = x
        this.Y = y
    }

    // 存档
    archive() {
        localStorage.setItem(FOODPOSITIONLS, JSON.stringify({x:this.X, y: this.Y}))
    }
    // 清档
    clearArchive() {
        localStorage.removeItem(FOODPOSITIONLS)
    }
    // 还原
    archiveRestore() {
        const positionData:IPositionA = JSON.parse(localStorage.getItem(FOODPOSITIONLS)!)
        this.X = positionData.x
        this.Y = positionData.y
        
    }

}

export default Food