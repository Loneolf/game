import ArchiveClass from '@u/archiveClass'
import { SCORESTATE } from './config'

class Score implements ArchiveClass {
    lever: number = 1 // 等级默认为1
    score: number = 0 // 分数默认为0
    maxLever: number// 默认最大等级为10
    changeLever: number // 吃多少个升级

    scoreEl: HTMLSpanElement;
    levelEl: HTMLSpanElement;

    constructor(changeLever: number = 10, maxLever: number = 10) {
        this.changeLever = changeLever
        this.maxLever = maxLever
        this.scoreEl = document.querySelector('#score')!
        this.levelEl = document.querySelector('#level')!
    }

    addScore() {
        this.scoreEl.innerText = ++this.score + ''
        if (this.score % this.changeLever === 0) {
            this.upLever()
        }
    }

    upLever() {
        if (this.lever < this.maxLever) {
            this.levelEl.innerText = ++this.lever + ''
        }
    }

    init() {
        this.lever = 1
        this.score = 0
        this.scoreEl.innerText = '0'
        this.levelEl.innerText = '1'
    }

     // 存档
     archive() {
        localStorage.setItem(SCORESTATE, JSON.stringify({score:this.score, lever: this.lever}))
    }
    // 清档
    clearArchive() {
        localStorage.removeItem(SCORESTATE)
    }
    // 还原
    archiveRestore() {
        const scoreData:{score: number, lever: number} = JSON.parse(localStorage.getItem(SCORESTATE)!)
        this.score = scoreData.score
        this.lever = scoreData.lever
        this.scoreEl.innerText = this.score + ''
        this.levelEl.innerText = this.lever + ''
    }

}

export default Score